import { memo, useEffect, useState } from 'react';
import { Principal } from "@dfinity/principal";
import { swap_backend } from 'declarations/swap_backend';
import { nns_ledger, idlFactory as nnsLedgerIdlFactory } from 'declarations/nns-ledger';

function App() {
  const NNS_LEDGER_CANISTER_ID = "ryjl3-tyaaa-aaaaa-aaaba-cai";
  const BACKEND_CANISTER_ID = "bd3sg-teaaa-aaaaa-qaaba-cai"
  const TOKEN_CANISTER_ID = "bkyz2-fmaaa-aaaaa-qaaaq-cai"
  const [isConnected, setIsConnected] = useState(false);

  async function checkThatPlugIsConnected() {
    try {
      const isConnected = await window.ic.plug.isConnected();
      if (isConnected) {
        console.log("Plug is connected");
        setIsConnected(isConnected);
      } else {
        setIsConnected(false);
      }
    } catch(e) {
      console.error("Error checking if plug is connected", e);
    }
  }
  useEffect(() => checkThatPlugIsConnected(), [])

  function connectPlug() {
    (async () => {
      try {
        const publicKey = await window.ic.plug.requestConnect({
          whitelist: [NNS_LEDGER_CANISTER_ID, BACKEND_CANISTER_ID],
        });
        console.log(`The connected user's public key is:`, publicKey);
        setIsConnected(true)
      } catch (e) {
        alert("error connecting plug wallet");
        console.log(e);
        setIsConnected(false)
      }
    })();
  }

  async function disconnectPlug() {
    await window.ic.plug.disconnect();
  }

  async function importToken() {
    window.ic.plug.requestImportToken({
      'canisterId': TOKEN_CANISTER_ID,
      'symbol': 'WBR23',
      'standard': 'ICRC-2',
      'logo': 'https://cryptologos.cc/logos/aptos-apt-logo.png',
    })
  }

  async function approveSpend() {
    const actor = await window.ic.plug.createActor({
      canisterId: NNS_LEDGER_CANISTER_ID,
      interfaceFactory: nnsLedgerIdlFactory,
    })

    const result = await actor.icrc2_approve({
      fee: [],
      memo: [],
      from_subaccount: [],
      created_at_time: [],
      amount: 100_0000_0000,
      expected_allowance: [],
      expires_at: [],
      spender: {
        owner: Principal.fromText(BACKEND_CANISTER_ID),
        subaccount: [],
      }
    });

    console.log({result})
  }

  return (
    <main>
      <img src="/logo2.svg" alt="DFINITY logo" />
      <br />
      <br />
      {isConnected ? (
        <div>
          <button onClick={disconnectPlug}>Disconnect Plug</button>
          <button onClick={approveSpend}>Approve Spend</button>
          <button onClick={importToken}>Import Token</button>
        </div>
      ) : (
        <button onClick={connectPlug}>Connect Plug</button>
      )}
    </main>
  );
}

export default App;
