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
        console.log("start fetching exchange rate");
        const rate = await exchangeRateActor.getExchangeRate();
        console.log(rate);
        setExchangeRate(rate.toString());
      } catch (err) {
        console.error("Error fetching exchange rate:", err);
        setError(err.toString());
      }
    }

    fetchExchangeRate();
  }, [swapBackendIdlFactory, swapBackendCanisterId]);

  useEffect(() => {
    console.log("exchangeRate has updated to:", exchangeRate);
  }, [exchangeRate]);

  if (error) return <div>Error: {error}</div>;

  return (
    <>
      <div className="text-white text-center text-lg mb-2">
        Exchange Rate: {exchangeRate}&nbsp;
        <img
          src="../public/favicon.png"
          alt="Bridge23 Logo"
          className="w-6 inline pb-1"
        />
      </div>
      <div className="text-white text-center text-lg mb-4">
        You will get: {exchangeRate * icpAmount}&nbsp;
        <img
          src="../public/favicon.png"
          alt="Bridge23 Logo"
          className="w-6 inline pb-1"
        />
      </div>
    </>
  );
}

export default ExchangeRate;
