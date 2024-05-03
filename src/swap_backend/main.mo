import Principal "mo:base/Principal";
import Result "mo:base/Result";
import Nat64 "mo:base/Nat64";
import Nat "mo:base/Nat";
import Bool "mo:base/Bool";
import Error "mo:base/Error";
import Text "mo:base/Text";
import Debug "mo:base/Debug";
import Blob "mo:base/Blob";
import Trie "mo:base/Trie";
import Map "mo:base/HashMap";
import List "mo:base/List";
import Buffer "mo:base/Buffer";
import Array "mo:base/Array";
import Time "mo:base/Time";
import Int "mo:base/Int";

import B23Token "canister:b23token";
import ICPLedger "canister:nns-ledger";
// import utils "./utils";

shared ({ caller = initializer }) actor class () = self {
  /**
  * Types
  */
  public type Account = Blob;
  type Tokens = {
    e8s : Nat64;
  };

  public type Log = {
    time : Int;
    principal : Principal;
    icp_amount_e8s : Nat;
    refcode : ?Text;
  };

  public type WithdrawalLog = {
    time : Int;
    amount : Nat64;
    receiver : Principal;
    royaltyAmount : Nat64;
    royaltyReceiver : Principal;
  };

  /**
  * Constants
  */
  let MAX_SALE_ICP : Nat = 250_0000_0000;
  let FEE : Nat = 10_000;
  let ROYALTY_ADDRESS : Principal = Principal.fromText("ij3n4-d5qbt-jvond-rhfxc-y5pyv-2mndy-jo6ai-kckej-5toee-p2qxq-2ae");
  let ROYALTY_PERCENTAGE : Nat64 = 5;

  /**
  * Storage
  */
  private stable var _owner : Principal = initializer;
  private stable var _icpReceived : Nat = 0;
  private stable var _tokenSold : Nat = 0;
  private stable var _exchangeRate : Nat = 200;
  private stable var _exchangeEnabled : Bool = false;
  private stable var _stableLogs : [Log] = [];
  private stable var _stableWithdrawalLogs : [WithdrawalLog] = [];

  var logs = Buffer.Buffer<Log>(1024);
  var withdrawalLogs = Buffer.Buffer<WithdrawalLog>(64);

  /**
  * Ownership control
  */
  public shared query func getOwner() : async Principal {
    return _owner;
  };

  public shared ({ caller }) func transferOwnership(newOwner : Principal) : async () {
    await requireOwner(caller);
    _owner := caller;
  };

  func requireOwner(principal : Principal) : async () {
    if (principal != _owner) {
      throw Error.reject("Unauthorized");
    };
  };

  /**
  * Swap functions
  */
  public shared ({ caller }) func swapIcpToToken(icp_amount_e8s : Nat, refcode : ?Text) : async () {
    if (not _exchangeEnabled) {
      throw Error.reject("Exchange is disabled");
    };

    if (icp_amount_e8s > MAX_SALE_ICP) {
      throw Error.reject("Max sale amount exceeded");
    };

    let canister_token_balance = await getTokenBalance();
    let token_amount = icp_amount_e8s * _exchangeRate;

    if (canister_token_balance < token_amount) {
      throw Error.reject("Not enough tokens in the canister");
    };

    let fee : ICPLedger.Icrc1Tokens = FEE;

    let allowance : ICPLedger.Allowance = await ICPLedger.icrc2_allowance({
      account = {
        owner = caller;
        subaccount = null;
      };
      spender = {
        owner = Principal.fromActor(self);
        subaccount = null;
      };
    });

    if (allowance.allowance <= icp_amount_e8s) {
      throw Error.reject("Not enough ICP allowance: " # debug_show (allowance));
    };

    try {
      let result : ICPLedger.TransferFromResult = await ICPLedger.icrc2_transfer_from({
        spender_subaccount = null;
        from = {
          owner = caller;
          subaccount = null;
        };
        to = {
          owner = Principal.fromActor(self);
          subaccount = null;
        };
        amount = icp_amount_e8s;
        fee = ?fee;
        memo = null;
        created_at_time = null;
      });

      switch (result) {
        case (#Err(error)) {
          throw Error.reject("Couldn't transfer ICP:\n" # debug_show (error) # "allowance: " # debug_show (allowance));
        };
        case (#Ok(_)) {
          _icpReceived += icp_amount_e8s;
        };
      };

      let transferArgs : B23Token.TransferArg = {
        from_subaccount = null;
        to = { owner = caller; subaccount = null };
        amount = token_amount;
        fee = null;
        memo = null;
        created_at_time = null;
      };

      let transferResult = await B23Token.icrc1_transfer(transferArgs);

      switch (transferResult) {
        case (#Err(transferError)) {
          throw Error.reject("Couldn't transfer tokens:\n" # debug_show (transferError));
        };
        case (#Ok(_)) {
          _tokenSold += token_amount;
          var log : Log = {
            time = Time.now();
            principal = caller;
            icp_amount_e8s = icp_amount_e8s;
            refcode = refcode;
          };

          logs.add(log);
        };
      };

    } catch (error : Error) {
      // catch any errors that might occur during the transfer
      throw Error.reject("Reject message: " # Error.message(error));
    };
  };

  /**
  * Query functions
  */

  public shared ({ caller }) func getCallerMainAccount() : async Account {
    return Principal.toLedgerAccount(caller, null);
  };

  public shared func getICPBalance() : async Nat {
    let result = await ICPLedger.icrc1_balance_of({
      owner = Principal.fromActor(self);
      subaccount = null;
    });

    return result;
  };

  public shared func getTokenBalance() : async Nat {
    let result = await B23Token.icrc1_balance_of({
      owner = Principal.fromActor(self);
      subaccount = null;
    });

    return result;
  };

  // Returns default account for the canister
  public query func getCanisterMainAccount() : async Account {
    return Principal.toLedgerAccount(Principal.fromActor(self), null);
  };

  public query func getLogs() : async [Log] {
    return logs.toArray();
  };

  public query func getWithdrawalLogs() : async [WithdrawalLog] {
    return withdrawalLogs.toArray();
  };

  public query func getICPReceived() : async Nat {
    return _icpReceived;
  };

  public query func getTokenSold() : async Nat {
    return _tokenSold;
  };

  public query func getExchangeRate() : async Nat {
    return _exchangeRate;
  };

  public query func isExchangeEnabled() : async Bool {
    return _exchangeEnabled;
  };

  /**
  * Admin area
  */

  public shared ({ caller }) func enableExchange() : async () {
    await requireOwner(caller);
    _exchangeEnabled := true;
  };

  public shared ({ caller }) func disableExchange() : async () {
    await requireOwner(caller);
    _exchangeEnabled := false;
  };

  public shared ({ caller }) func setExchangeRate(rate : Nat) : async () {
    await requireOwner(caller);
    _exchangeRate := rate;
  };

  public shared ({ caller }) func withdrawICP(toPrincipal : Principal, amount : Nat64) : async Result.Result<ICPLedger.BlockIndex, Text> {
    await requireOwner(caller);

    let amountWithoutComission : Nat64 = amount - 20_000;
    let royaltyAmount : Nat64 = amountWithoutComission * ROYALTY_PERCENTAGE / 100;
    let amountToWithrdaw : Nat64 = amountWithoutComission - royaltyAmount;

    let royaltyTransferArgs : ICPLedger.TransferArgs = {
      memo = 0;
      amount = { e8s = royaltyAmount };
      fee = { e8s = 10_000 };
      from_subaccount = null;
      to = Principal.toLedgerAccount(ROYALTY_ADDRESS, null);
      created_at_time = null;
    };

    let transferArgs : ICPLedger.TransferArgs = {
      memo = 0;
      amount = { e8s = amountToWithrdaw };
      fee = { e8s = 10_000 };
      from_subaccount = null;
      to = Principal.toLedgerAccount(toPrincipal, null);
      created_at_time = null;
    };

    try {
      // transfer royalty
      let royaltyTransferResult = await ICPLedger.transfer(royaltyTransferArgs);
      switch (royaltyTransferResult) {
        case (#Err(transferError)) {
          return #err("Couldn't transfer funds:\n" # debug_show (transferError));
        };
        case (#Ok(_)) {};
      };

      // initiate the transfer
      let transferResult = await ICPLedger.transfer(transferArgs);

      // check if the transfer was successfull
      switch (transferResult) {
        case (#Err(transferError)) {
          return #err("Couldn't transfer funds:\n" # debug_show (transferError));
        };
        case (#Ok(blockIndex)) {
          let withdrawalLog : WithdrawalLog = {
            time = Time.now();
            amount = amountToWithrdaw;
            receiver = toPrincipal;
            royaltyAmount = royaltyAmount;
            royaltyReceiver = ROYALTY_ADDRESS;
          };
          withdrawalLogs.add(withdrawalLog);
          return #ok blockIndex;
        };
      };
    } catch (error : Error) {
      // catch any errors that might occur during the transfer
      return #err("Reject message: " # Error.message(error));
    };
  };

  public shared ({ caller }) func withdrawTokens(toPrincipal : Principal, amount : Nat) : async Result.Result<B23Token.BlockIndex, Text> {
    await requireOwner(caller);

    let transferArgs : B23Token.TransferArg = {
      from_subaccount = null;
      to = { owner = toPrincipal; subaccount = null };
      amount = amount;
      fee = null;
      memo = null;
      created_at_time = null;
    };

    try {
      // initiate the transfer
      let transferResult = await B23Token.icrc1_transfer(transferArgs);

      // check if the transfer was successfull
      switch (transferResult) {
        case (#Err(transferError)) {
          return #err("Couldn't transfer funds:\n" # debug_show (transferError));
        };
        case (#Ok(blockIndex)) {
          return #ok blockIndex;
        };
      };
    } catch (error : Error) {
      // catch any errors that might occur during the transfer
      return #err("Reject message: " # Error.message(error));
    };
  };

  system func preupgrade() {
    _stableLogs := logs.toArray();
    _stableWithdrawalLogs := withdrawalLogs.toArray();
  };

  system func postupgrade() {
    logs := Buffer.fromArray<Log>(_stableLogs);
    withdrawalLogs := Buffer.fromArray<WithdrawalLog>(_stableWithdrawalLogs);
  };
};

// actor SwapBackend {
//   public type E8S = Nat64;

//   private stable var isInitialized : Bool = false;
//   private stable var owner : Principal = Principal.fromActor(SwapBackend);

//   public shared query func getOwner() : async Principal {
//     return owner;
//   };

//   public shared ({ caller }) func init() : async () {
//     if (isInitialized) {
//       throw Error.reject("Already initialized");
//     };

//     owner := caller;
//     isInitialized := true;
//   };

//   // Returns default account for the canister
//   public query func getCanisterMainAccount() : async Account {
//     return Principal.toLedgerAccount(Principal.fromActor(SwapBackend), null);
//   };

//   // Returns the account address of caller where they should deposit ICP
//   public shared ({ caller }) func getICPDepositAccount() : async Blob {
//     return _getAccount(caller);
//   };

//   // Returns the current deposit balance of the caller
//   public shared ({ caller }) func getDepositBalance() : async E8S {
//     return await _getDepositBalance(caller);
//   };

//   // Main function that will
//   // - Move the ICP from subaccount to main account
//   // - Release the swapped tokens to the caller
//   public shared ({ caller }) func notifyAndSwap() : async () {
//     let deposit_balance = await _getDepositBalance(caller);
//     let account = _getAccount(caller);
//   };

//   private func _getDepositBalance(caller : Principal) : async E8S {
//     let result = await ICPLedger.account_balance({
//       account = _getAccount(caller);
//     });

//     return result.e8s;
//   };

//   private func _getAccount(caller : Principal) : Account {
//     let subaccount = utils.toSubaccount(caller);
//     let own_principal = Principal.fromActor(SwapBackend);

//     return Principal.toLedgerAccount(own_principal, ?subaccount);
//   };
// };
