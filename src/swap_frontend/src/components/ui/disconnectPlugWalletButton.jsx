import React from "react";
import { Button } from "./button";

function DisconnectPlugWalletButton({ setIsConnected }) {
  async function disconnectPlug() {
    if (isPlugWalletAvailable()) {
      try {
        setIsConnected(false);
        await window.ic.plug.disconnect();
      } catch (error) {
        console.error("Failed to disconnect the Plug Wallet:", error);
      }
    } else {
      console.log("Plug Wallet is not available.");
    }
  }

  function isPlugWalletAvailable() {
    return window.ic && window.ic.plug;
  }

  return (
    <div>
      <Button
        onClick={disconnectPlug}
        className="absolute top-0 right-0 m-4 text-white text-lg bg-indigo-500 hover:bg-indigo-600 py-2 rounded shadow-lg shadow-indigo-600/50"
        >
        Disconnect
      </Button>
    </div>
  );
}

export default DisconnectPlugWalletButton;
