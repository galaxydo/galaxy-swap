import { memo, useEffect, useState } from 'react';
import { Principal } from "@dfinity/principal";
import { canisterId as b23CanisterId } from '../../declarations/b23token';
import { swap_backend, idlFactory as swapBackendIdlFactory, canisterId as swapBackendCanisterId } from 'declarations/swap_backend';
import { nns_ledger, idlFactory as nnsLedgerIdlFactory, canisterId as nnsLedgerCanisterId } from 'declarations/nns-ledger';
import { Button } from './components/ui/button';
import { Card } from './components/ui/card';
import { useToast } from "./components/ui/use-toast";
import NumberInput from './components/ui/NumberInput';

function App() {
  const NNS_LEDGER_CANISTER_ID = nnsLedgerCanisterId;
  const BACKEND_CANISTER_ID = swapBackendCanisterId;
  const TOKEN_CANISTER_ID = b23CanisterId;
  const [isConnected, setIsConnected] = useState(false);
  const { toast } = useToast();
  const [spendAmount, setSpendAmount] = useState(10);
  
  async function checkThatPlugIsConnected() {
    try {
      const isConnected = await window.ic.plug.isConnected();
      if (isConnected) {
        console.log("Plug is connected");
        setIsConnected(isConnected);
      } else {
        setIsConnected(false);
      }
    } catch (e) {
      console.error("Error checking if plug is connected", e);
    }
  }
  useEffect(() => checkThatPlugIsConnected(), [])

  const isPlugWalletAvailable = () => {
    return window.ic && window.ic.plug;
  };

  const connectPlugWallet = async () => {
    if (isPlugWalletAvailable()) {
      try {
        const publicKey = await window.ic.plug.requestConnect({
          whitelist: [NNS_LEDGER_CANISTER_ID, BACKEND_CANISTER_ID],
        });
        console.log(`The connected user's public key is:`, publicKey);
        if (publicKey) {
          toast({
            title: "Success",
            description: "Your Plug wallet has been successfully connected 🥳",
          });
          setIsConnected(true);
        }
      } catch (error) {
        console.error("Plug Wallet connection error:", error);
        setIsConnected(false);
        toast({
          title: "Error",
          description: "Failed to connect your Plug wallet.",
        });
      }
    } else {
      console.log("Plug Wallet is not available.");
      setIsConnected(false);
      toast({
        title: "Unavailable",
        description: "Plug wallet is not available. Please install Plug wallet to connect.",
      });
    }
  };
  
  async function disconnectPlug() {
      if (isPlugWalletAvailable()) {
        // await window.ic.plug.disconnect();
        setIsConnected(false);
      }
  }

  async function importToken() {
    window.ic.plug.requestImportToken({
      'canisterId': TOKEN_CANISTER_ID,
      'symbol': 'WBR23',
      'standard': 'ICRC-1',
      'logo': 'https://cryptologos.cc/logos/aptos-apt-logo.png',
    })
  }

  const handleSpendAmountChange = (newAmount) => {
    setSpendAmount(newAmount);
  };

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
      amount: spendAmount,
      expected_allowance: [],
      expires_at: [],
      spender: {
        owner: Principal.fromText(BACKEND_CANISTER_ID),
        // owner: BACKEND_CANISTER_ID,
        subaccount: [],
      }
    });

    console.log({ result })
  }

  async function performSwap() {
    const actor = await window.ic.plug.createActor({
      canisterId: BACKEND_CANISTER_ID,
      interfaceFactory: swapBackendIdlFactory,
    })

    const result = await actor.swapIcpToToken(1_000_000);

    console.log({ result })
  }

  return (
    <main>
      {isConnected ? (
        // <Card>
        //   <Button onClick={disconnectPlug} variant="default">Disconnect Plug</Button>
        //   <Button onClick={approveSpend} variant="default">Approve Spend</Button>
        //   <Button onClick={performSwap} variant="default">Perform Swap 0.01 ICP</Button>
        //   <Button onClick={importToken} variant="default">Import Token</Button>
        // </Card>
        <div className="flex items-center justify-center min-h-screen">
          <Card className="max-w-sm w-full bg-white shadow-lg rounded-lg p-8">
            <h1 className="text-xl font-semibold text-gray-700 text-center">Bridge23 Early Investors</h1>
            <p className="text-gray-600 mt-4 text-center">
              We need to approve ICP spend to charge your plug wallet.
            </p>
            <NumberInput
              initial={spendAmount}
              min={1}
              max={250}
              onChange={handleSpendAmountChange}
            />  
              <p className="text-gray-600 mt-4 text-center">
                Max buy 250 ICP
              </p>          
            <Button onClick={approveSpend} 
                className="text-white bg-gray-800 hover:bg-gray-900 w-full py-2 rounded"
                disabled={spendAmount < 1 || spendAmount > 250}
            >
              Approve Spend
            </Button>
          </Card>
        </div>
        
      ) : (
        <div className="flex items-center justify-center min-h-screen">
          <Card className="max-w-sm w-full bg-white shadow-lg rounded-lg p-8">
            <h1 className="text-xl font-semibold text-gray-700 text-center">Bridge23 Early Investors</h1>
            <p className="text-gray-600 mt-4 text-center">
              Dear friend, It's an honor for us to see you as one of the early investors.
            </p>
            <p className="text-gray-500 text-sm mt-1 text-center">
              Your investment is the seed that grows tomorrow's innovations. 
              Thank you for being the early champions of change with Bridge23.       
            </p>
            <div className="mt-8">
              <Button
                onClick={connectPlugWallet}
                className="text-white bg-blue-500 hover:bg-blue-600 w-full py-2 rounded"
              >
                Connect Plug Wallet
              </Button>
            </div>
            <p className="text-xs text-gray-400 mt-4 text-center">
              Don't have plug wallet? <a href="#" className="underline">Download it here</a>
            </p>
          </Card>
        </div>
    )}
    </main>
  );
}

export default App;
