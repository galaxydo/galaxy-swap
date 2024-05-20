# Swap canister

This canister:

1. Gives each logged in user a canister ledger subaccount where the user should deposit their ICP
2.

### Local environment setup

0. Make sure that you have installed local NNS using this guide. https://internetcomputer.org/docs/current/developer-docs/developer-tools/cli-tools/cli-reference/dfx-nns/#dfx-nns-install

Double-check that `cat "$(dfx info networks-json-path)"`

gives you this:

```
{
   "local": {
      "bind": "0.0.0.0:8080",
      "type": "ephemeral",
      "replica": {
         "subnet_type": "system",
         "port": 8000
      }
   }
}
```

Alternative if you can't check, you need to follow this step

1. Open your terminal and navigate to the dfx configuration directory `cd /root/.config/dfx`
2. Use a text editor to create or modify the networks.json file `nano networks.json`
3. Copy and paste the following content into the networks.json file
4. Save and exit the editor. In nano, you can do this by pressing CTRL+X, then press Y to confirm saving, and finally press Enter
5. Make sure there are no contradictory network settings in your project’s dfx.json, navigate to `cd /root/swap`
6. Open the dfx.json file in a text editor `nano dfx.json`
7. Ensure no networks configurations conflict or redefine the local network setup there. If found, modify or remove them

Running dfx processes

1. Run `dfx start --clean` in the first terminal. leave it running there so that you see the logs
2. In a separate terminal run `dfx nns install` and wait for it to finish

Note the output of this command it will give you something like

```
Frontend canisters:
internet_identity     http://qhbym-qaaaa-aaaaa-aaafq-cai.localhost:8080/
nns-dapp              http://qsgjb-riaaa-aaaaa-aaaga-cai.localhost:8080/

```

You can use those urls to access local nns and local internet identity

3. Create an identitiy with `dfx identity new b23dev`
4. Get your idenitiy principal with `dfx identity get-principal`. Write it down
5. Run `dfx deploy`
6. On the first deployment you will be asked to initialize b23token canister.

When you see this:

```
Installing code for canister b23token, with canister ID bkyz2-fmaaa-aaaaa-qaaaq-cai
This canister requires an initialization argument.
Enter a value for LedgerArg : variant { Upgrade : opt UpgradeArgs; Init : InitArgs }
? Select a variant ›
  Upgrade
  Init
```

Choose "Init"

Here's a log of my intialization. Whenever you are asked for principal use the principal from stage 4.

```
This canister requires an initialization argument.
Enter a value for LedgerArg : variant { Upgrade : opt UpgradeArgs; Init : InitArgs }
✔ Select a variant · Init
  Enter a value for InitArgs
  ✔ Enter optional field decimals : opt nat8? · no
  Enter field token_symbol : text
    ✔ Enter a text (type :e to use editor) · B23
  Enter field transfer_fee : nat
    ✔ Enter a nat · 10000
  Enter field metadata : vec record { text; MetadataValue }
    ✔ Do you want to enter a new vector element? · no
  Enter field minting_account : Account
    Enter a value for Account : record { owner : principal; subaccount : opt Subaccount }
    Enter field owner : principal
      Auto-completions: anonymous, b23token, default, icp-ident-RqOPnjj5ERjAEnwlvfKw, nns-cycles-minting, nns-genesis-token, nns-governance, nns-ledger, nns-lifeline, nns-registry, nns-root, nns-sns-wasm, swap_backend, swap_frontend, test-neuron-1-owner__b2ucp-4x6ou-zvxwi-niymn-pvllt-rdxqr-wi4zj-jat5l-ijt2s-vv4f5-4ae
      ✔ Enter a principal · tlw7j-oxodg-we7y7-kud7l-kwuvl-bpc3q-parcz-dnt2h-7wemc-on4ij-rae
    ✔ Enter optional field subaccount : opt Subaccount? · no
  Enter field initial_balances : vec record { Account; nat }
    ✔ Do you want to enter a new vector element? · no
  ✔ Enter optional field maximum_number_of_accounts : opt nat64? · no
  ✔ Enter optional field accounts_overflow_trim_quantity : opt nat64? · no
  ✔ Enter optional field fee_collector_account : opt Account? · no
  Enter field archive_options
    Enter field num_blocks_to_archive : nat64
      ✔ Enter a nat64 · 100000
    ✔ Enter optional field max_transactions_per_response : opt nat64? · no
    Enter field trigger_threshold : nat64
      ✔ Enter a nat64 · 20000
    ✔ Enter optional field more_controller_ids : opt vec principal? · no
    ✔ Enter optional field max_message_size_bytes : opt nat64? · no
    ✔ Enter optional field cycles_for_archive_creation : opt nat64? · no
    ✔ Enter optional field node_max_memory_size_bytes : opt nat64? · no
    Enter field controller_id : principal
      Auto-completions: anonymous, b23token, default, icp-ident-RqOPnjj5ERjAEnwlvfKw, nns-cycles-minting, nns-genesis-token, nns-governance, nns-ledger, nns-lifeline, nns-registry, nns-root, nns-sns-wasm, swap_backend, swap_frontend, test-neuron-1-owner__b2ucp-4x6ou-zvxwi-niymn-pvllt-rdxqr-wi4zj-jat5l-ijt2s-vv4f5-4ae
      ✔ Enter a principal · tlw7j-oxodg-we7y7-kud7l-kwuvl-bpc3q-parcz-dnt2h-7wemc-on4ij-rae
  ✔ Enter optional field max_memo_length : opt nat16? · no
  Enter field token_name : text
    ✔ Enter a text (type :e to use editor) · Galaxy
  ✔ Enter optional field feature_flags : opt FeatureFlags? · no
Sending the following argument:
(
  variant {
    Init = record {
      decimals = null;
      token_symbol = "B23";
      transfer_fee = 10_000 : nat;
      metadata = vec {};
      minting_account = record {
        owner = principal "tlw7j-oxodg-we7y7-kud7l-kwuvl-bpc3q-parcz-dnt2h-7wemc-on4ij-rae";
        subaccount = null;
      };
      initial_balances = vec {};
      maximum_number_of_accounts = null;
      accounts_overflow_trim_quantity = null;
      fee_collector_account = null;
      archive_options = record {
        num_blocks_to_archive = 100_000 : nat64;
        max_transactions_per_response = null;
        trigger_threshold = 20_000 : nat64;
        more_controller_ids = null;
        max_message_size_bytes = null;
        cycles_for_archive_creation = null;
        node_max_memory_size_bytes = null;
        controller_id = principal "tlw7j-oxodg-we7y7-kud7l-kwuvl-bpc3q-parcz-dnt2h-7wemc-on4ij-rae";
      };
      max_memo_length = null;
      token_name = "Galaxy";
      feature_flags = null;
    }
  },
)

Do you want to initialize the canister with this argument? [y/N]
choose y to continue to final process
```

The expected output similar like this:
Deployed canisters.

````
URLs:
  Frontend canister via browser
    swap_frontend: http://0.0.0.0:8080/?canisterId=be2us-64aaa-aaaaa-qaabq-cai
  Backend canister via Candid interface:
    b23token: http://0.0.0.0:8080/?canisterId=br5f7-7uaaa-aaaaa-qaaca-cai&id=bkyz2-fmaaa-aaaaa-qaaaq-cai
    swap_backend: http://0.0.0.0:8080/?canisterId=br5f7-7uaaa-aaaaa-qaaca-cai&id=bd3sg-teaaa-aaaaa-qaaba-cai
    ```
````