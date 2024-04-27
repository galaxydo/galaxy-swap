import { memo, useEffect, useState } from 'react';
import { Principal } from "@dfinity/principal";
import { canisterId as b23CanisterId } from '../../declarations/b23token';
import { swap_backend, idlFactory as swapBackendIdlFactory, canisterId as swapBackendCanisterId } from 'declarations/swap_backend';
import { nns_ledger, idlFactory as nnsLedgerIdlFactory, canisterId as nnsLedgerCanisterId } from 'declarations/nns-ledger';

function App() {
  const NNS_LEDGER_CANISTER_ID = nnsLedgerCanisterId;
  const BACKEND_CANISTER_ID = swapBackendCanisterId;
  const TOKEN_CANISTER_ID = b23CanisterId;
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
      'standard': 'ICRC-1',
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
      amount: 1_000_000 + 10_000,
      expected_allowance: [],
      expires_at: [],
      spender: {
        owner: Principal.fromText(BACKEND_CANISTER_ID),
        // owner: BACKEND_CANISTER_ID,
        subaccount: [],
      }
    });

    console.log({result})
  }

  async function performSwap() {
    const actor = await window.ic.plug.createActor({
      canisterId: BACKEND_CANISTER_ID,
      interfaceFactory: swapBackendIdlFactory,
    })

    const result = await actor.swapIcpToToken(1_000_000);

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
          <button onClick={approveSpend}>Approve Spend 0.01</button>
          <button onClick={performSwap}>Perform Swap 0.01 ICP</button>
          <button onClick={importToken}>Import Token</button>
        </div>
      ) : (
        <button onClick={connectPlug}>Connect Plug</button>
      )}
    </main>
  );
}

export default App;
