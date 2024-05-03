import { useState, useEffect } from "react";
import { Actor, HttpAgent } from "@dfinity/agent";

function ExchangeRate({
  swapBackendIdlFactory,
  swapBackendCanisterId,
  icpAmount,
}) {
  const [exchangeRate, setExchangeRate] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    const agent = new HttpAgent();
    const exchangeRateActor = Actor.createActor(swapBackendIdlFactory, {
      agent,
      canisterId: swapBackendCanisterId,
    });

    async function fetchExchangeRate() {
      setError(null);
      try {
        const rate = await exchangeRateActor.getExchangeRate();
        setExchangeRate(rate.toString());
      } catch (err) {
        console.error("Error fetching exchange rate:", err);
        setError(err.toString());
      }
    }

    fetchExchangeRate();
  }, [swapBackendIdlFactory, swapBackendCanisterId]);

  if (error) return <div></div>;

  return (
    <>
      <div className=" text-center text-lg mb-2">
        Exchange Rate: 1 ICP = {exchangeRate}&nbsp;
        <img
          src="/favicon.png"
          alt="Bridge23 Logo"
          className="w-6 inline pb-1"
        />
      </div>
      <div className=" text-center text-lg mb-4">
        You will get: {exchangeRate * icpAmount}&nbsp;
        <img
          src="/favicon.png"
          alt="Bridge23 Logo"
          className="w-6 inline pb-1"
        />
      </div>
    </>
  );
}

export default ExchangeRate;
