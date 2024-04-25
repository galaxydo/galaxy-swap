import Principal "mo:base/Principal";
import Result "mo:base/Result";
import Nat64 "mo:base/Nat64";
import Nat "mo:base/Nat";
import Bool "mo:base/Bool";
import Error "mo:base/Error";
import Text "mo:base/Text";
import Debug "mo:base/Debug";
import Blob "mo:base/Blob";

import B23Token "canister:b23token";
import ICPLedger "canister:nns-ledger";
// import utils "./utils";

shared ({ caller = initializer }) actor class () = self {
  /**
  * Storage
  */
  private stable var _owner : Principal = initializer;
  private stable var _icpReceived : Nat64 = 0;
  private stable var _tokenSold : Nat64 = 0;
  private stable var _exchangeRate : Nat64 = 200;
  private stable var _exchangeEnabled : Bool = false;

  /**
  * Types
  */
  public type Account = Blob;
  type Tokens = {
    e8s : Nat64;
  };

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
  public shared ({ caller }) func swapIcpToToken(icp_amount_e8s : Nat64) : async () {
    if (not _exchangeEnabled) {
      throw Error.reject("Exchange is disabled");
    };

    let token_amount : Nat64 = icp_amount_e8s * _exchangeRate;

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

    if (allowance.allowance <= Nat64.toNat(icp_amount_e8s)) {
      throw Error.reject("Not enough ICP allowance");
    };
  };

  /**
  * Query functions
  */

  public shared ({ caller }) func getCallerMainAccount() : async Account {
    return Principal.toLedgerAccount(caller, null);
  };

  // Returns default account for the canister
  public query func getCanisterMainAccount() : async Account {
    return Principal.toLedgerAccount(Principal.fromActor(self), null);
  };

  public query func getICPReceived() : async Nat64 {
    return _icpReceived;
  };

  public query func getTokenSold() : async Nat64 {
    return _tokenSold;
  };

  public query func getExchangeRate() : async Nat64 {
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

  public shared ({ caller }) func setExchangeRate(rate : Nat64) : async () {
    await requireOwner(caller);
    _exchangeRate := rate;
  };

  public shared ({ caller }) func withdrawICP(toPrincipal : Principal, amount : Tokens) : async Result.Result<ICPLedger.BlockIndex, Text> {
    await requireOwner(caller);
    let transferArgs : ICPLedger.TransferArgs = {
      memo = 0;
      amount = amount;
      fee = { e8s = 10_000 };
      from_subaccount = null;
      to = Principal.toLedgerAccount(toPrincipal, null);
      created_at_time = null;
    };

    try {
      // initiate the transfer
      let transferResult = await ICPLedger.transfer(transferArgs);

      // check if the transfer was successfull
      switch (transferResult) {
        case (#Err(transferError)) {
          return #err("Couldn't transfer funds:\n" # debug_show (transferError));
        };
        case (#Ok(blockIndex)) { return #ok blockIndex };
      };
    } catch (error : Error) {
      // catch any errors that might occur during the transfer
      return #err("Reject message: " # Error.message(error));
    };
  };

  public shared ({ caller }) func withdrawTokens(toPrincipal : Principal, amount : Nat64) : async Result.Result<B23Token.BlockIndex, Text> {
    await requireOwner(caller);

    let transferArgs : B23Token.TransferArg = {
      from_subaccount = null;
      to = { owner = toPrincipal; subaccount = null };
      amount = Nat64.toNat(amount);
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
        case (#Ok(blockIndex)) { return #ok blockIndex };
      };
    } catch (error : Error) {
      // catch any errors that might occur during the transfer
      return #err("Reject message: " # Error.message(error));
    };
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
