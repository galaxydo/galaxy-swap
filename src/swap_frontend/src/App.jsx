import { memo, useEffect, useState } from "react";
import { Principal } from "@dfinity/principal";
import {
  canisterId as b23CanisterId,
  idlFactory as b23AdlFactory,
} from "../../declarations/b23token";
import {
  swap_backend,
  idlFactory as swapBackendIdlFactory,
  canisterId as swapBackendCanisterId,
} from "declarations/swap_backend";
import {
  nns_ledger,
  idlFactory as nnsLedgerIdlFactory,
  canisterId as nnsLedgerCanisterId,
} from "declarations/nns-ledger";
import { Button } from "./components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./components/ui/card";
import { useToast } from "./components/ui/use-toast";
import NumberInput from "./components/ui/numberInput";
import Spinner from "./components/ui/spinner";
import { ArrowLeft } from "lucide-react";

function App() {
  const NNS_LEDGER_CANISTER_ID = nnsLedgerCanisterId;
  const BACKEND_CANISTER_ID = swapBackendCanisterId;
  const TOKEN_CANISTER_ID = b23CanisterId;

  const [isConnected, setIsConnected] = useState(false);
  const { toast } = useToast();
  const [spendAmount, setSpendAmount] = useState(10);
  const [loading, setLoading] = useState(false);
  const [approved, setApproved] = useState(false);
  const [copySuccess, setCopySuccess] = useState("");
  const [onSwapScreen, setOnSwapScreen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth > 768);

  useEffect(() => {
    checkThatPlugIsConnected();
    const handleResize = () => {
      setIsDesktop(window.innerWidth > 768);
    }

    window.addEventListener('resize', handleResize);
  }, []);

  if (!isDesktop) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center p-4">
          <h1 className="text-lg text-red-500">Please use a desktop browser to access this webpage.</h1>
        </div>
      </div>
    );
  }

  async function checkThatPlugIsConnected() {
    try {
      const isConnected = await window.ic.plug.isConnected();
      setIsConnected(isConnected);
      console.log("Plug is connected");
    } catch (e) {
      console.error("Error checking if plug is connected", e);
      setIsConnected(false);
    }
  }

  const isPlugWalletAvailable = () => {
    return window.ic && window.ic.plug;
  };

  const connectPlugWallet = async () => {
    if (isPlugWalletAvailable()) {
      try {
        const publicKey = await window.ic.plug.requestConnect({
          whitelist: [NNS_LEDGER_CANISTER_ID, BACKEND_CANISTER_ID],
        });
        setIsConnected(true);
        console.log(`The connected user's public key is:`, publicKey);
      } catch (error) {
        console.error("Plug Wallet connection error:", error);
        setIsConnected(false);
      }
    } else {
      console.log("Plug Wallet is not available.");
      setIsConnected(false);
    }
  };

  async function disconnectPlug() {
    if (isPlugWalletAvailable()) {
      // await window.ic.plug.disconnect();
      setIsConnected(false);
    }
  }

  async function importToken() {
    try {
      await window.ic.plug.requestImportToken({
        canisterId: TOKEN_CANISTER_ID,
        symbol: "WBR23",
        standard: "ICRC-1",
        logo: "https://cryptologos.cc/logos/aptos-apt-logo.png",
      });
    } catch (error) {
      console.error("Failed to import token", error);
    }
  }

  const handleSpendAmountChange = (newAmount) => {
    setSpendAmount(newAmount);
  };

  async function approveSpend() {
    if (!isPlugWalletAvailable()) return;
    setLoading(true);
    try {
      const actor = await window.ic.plug.createActor({
        canisterId: NNS_LEDGER_CANISTER_ID,
        interfaceFactory: nnsLedgerIdlFactory,
      });

      const result = await actor.icrc2_approve({
        fee: [],
        memo: [],
        from_subaccount: [],
        created_at_time: [],
        amount: spendAmount + 10_000,
        expected_allowance: [],
        expires_at: [],
        spender: {
          owner: Principal.fromText(BACKEND_CANISTER_ID),
          // owner: BACKEND_CANISTER_ID,
          subaccount: [],
        },
      });
      console.log("Approve:", result);
      setApproved(true);
    } catch (error) {
      console.error("Error during transaction approval:", error);
    }
    setLoading(false);
  }

  const handleGoBack = () => {
    setOnSwapScreen(false);
    setApproved(false);
  };

  async function performSwap() {
    if (!isPlugWalletAvailable()) {
      console.log("Plug Wallet is not available.");
      return;
    }
    setLoading(true);
    setOnSwapScreen(true);
    try {
      const actor = await window.ic.plug.createActor({
        canisterId: BACKEND_CANISTER_ID,
        interfaceFactory: swapBackendIdlFactory,
      });
      console.log(
        "Actor created successfully, attempting to call swapIcpToToken.",
        actor
      );
      const result = await actor.swapIcpToToken(spendAmount);
      console.log("Swap token:", result);
    } catch (error) {
      console.error("Error performing swap:", error);
    }
    setLoading(false);
  }

  const copyToClipboard = (text) => {
    navigator.clipboard
      .writeText(text)
      .then(() => setCopySuccess("Copied!"))
      .catch((err) => console.error("Failed to copy text: ", err));
  };

  const connectPlugWalletPage = (
    <>
      <CardHeader className="text-center text-white space-y-10">
        <CardTitle className="">Bridge23 Early Investors</CardTitle>
        <CardTitle className="text-lg">
          Dear friend, It's an honor for us to see you as one of the early
          investors.
        </CardTitle>
        <CardDescription className="text-white">
          Your investment is the seed that grows tomorrow's innovations. Thank
          you for being the early champions of change with Bridge23.
        </CardDescription>
      </CardHeader>
      <CardFooter className="text-center">
        <Button
          onClick={connectPlugWallet}
          className="text-white text-lg bg-indigo-500 hover:bg-indigo-600 w-full py-2 rounded shadow-lg"
        >
          Connect Plug Wallet
        </Button>
      </CardFooter>
      <p className="text-xs text-gray-400 mt-4 text-center">
        Don't have plug wallet?{" "}
        <a
          href="https://plugwallet.ooo/"
          className="underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          Download it here
        </a>
      </p>
    </>
  );

  const approveSpendPage = (
    <>
      <CardHeader className="text-center text-white space-y-10">
        <CardTitle>Bridge23 Early Investors</CardTitle>
        <CardDescription className="text-white text-lg">
          We need to approve ICP spend to charge your plug wallet.
        </CardDescription>
      </CardHeader>
      <NumberInput
        initial={spendAmount}
        min={1}
        max={250}
        onChange={handleSpendAmountChange}
      />
      <div className="text-sm text-white mt-3 mb-7 text-center">
        Max buy 250 ICP
      </div>
      <CardFooter className="text-center">
        <Button
          onClick={approveSpend}
          className="text-white text-lg bg-indigo-500 hover:bg-indigo-600 w-full py-2 rounded shadow-lg"
          disabled={spendAmount < 1 || spendAmount > 250 || loading}
        >
          {loading && <Spinner />}
          {loading && <span className="mr-2"></span>}
          <span>{loading ? "Loading..." : "Approve Spend"}</span>
        </Button>
      </CardFooter>
    </>
  );

  const swapTokenPage = (
    <>
      <CardHeader className=" text-white p-6 rounded-lg max-w-sm mx-auto mt-2">
        {!loading && (
          <div className="flex items-center mb-4">
            <button onClick={handleGoBack} className="rounded-full p-2 mr-2">
              <ArrowLeft className="rounded-full  w-4 h-4" />
            </button>
            <span className="text-sm">Go Back</span>
          </div>
        )}
        <CardTitle className="">Bridge23 Early Investors</CardTitle>
      </CardHeader>
      <div className="text-white text-center w-3/4 mx-auto shadow-lg bg-indigo-400 mb-6 rounded-lg py-2">
        {spendAmount} ICP
      </div>
      <Button
        onClick={performSwap}
        disabled={loading}
        className="text-white text-lg bg-indigo-500 hover:bg-indigo-600 w-full py-2 rounded shadow-lg"
      >
        {loading && <Spinner />}
        {loading && <span className="mr-2"></span>}
        <span>{loading ? "Loading..." : "Perform Swap"}</span>
      </Button>
      <CardFooter className="text-center"></CardFooter>
      {loading && (
        <div className="text-white">
          The process will take around 1-2 minutes. <br /> <br />
          Make sure to add our token to your Plug Wallet. <br />
          <br />
          Instructions: <br />
          1. Go to your Plug Wallet. <br />
          2. Click on "Add Token" <br />
          3. Select "Custom"
          <br />
          4. Token canister ID: <br />
          <p
            className="text-lg text-center text-lime-200 underline hover:no-underline cursor-pointer"
            onClick={() => copyToClipboard(BACKEND_CANISTER_ID)}
          >
            {BACKEND_CANISTER_ID}
          </p>
          5. Token standard: ICRC1
          <br />
          6. Continue
          <br />
          Success!&nbsp; 🎉 🥳
        </div>
      )}
    </>
  );

  return (
    <main>
      <div className="flex items-center justify-center min-h-screen">
        <Card className="max-w-sm w-full bg-indigo-900 shadow-2xl shadow-indigo-600/50 rounded-lg p-4 border-none">
          {isConnected
            ? approved
              ? swapTokenPage
              : approveSpendPage
            // If isConnected, also provide a link to download the Plug Wallet
            : <>
              {connectPlugWalletPage}
              <div className="mt-4 text-center">
                {isConnected && (
                  <a
                    href="https://plugwallet.ooo/"
                    className="text-blue-500 underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Download or Open Plug Wallet
                  </a>
                )}
              </div>
            </>
          }
        </Card>
      </div>
    </main>
  );
}

export default App;

//   <Button onClick={disconnectPlug} variant="default">Disconnect Plug</Button>
//   <Button onClick={approveSpend} variant="default">Approve Spend</Button>
//   <Button onClick={performSwap} variant="default">Perform Swap 0.01 ICP</Button>
//   <Button onClick={importToken} variant="default">Import Token</Button>
