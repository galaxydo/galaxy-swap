import { useState, useEffect } from "react";
import { Actor, HttpAgent } from "@dfinity/agent";

const IC_MAINNET_URL = "https://icp0.io/";
const MAINNET_CANISTER_ID = "oyzj3-naaaa-aaaag-qjuka-cai";

function useAdminData(swapBackendIdlFactory) {
  const [data, setData] = useState({
    logs: [],
    exchangeRate: "",
    icpBalance: "",
    icpReceived: "",
    ispReceived: "",
  });
  const [error, setError] = useState(null);
  const [loadingState, setLoadingState] = useState({
    logs: true,
    exchangeRate: true,
    icpBalance: true,
    tokenBalance: "",
    tokenSold: "",
    icpReceived: true,
  });

  const setLoading = (key, isLoading) => {
    setLoadingState((prev) => ({ ...prev, [key]: isLoading }));
  };
  const fetchData = async () => {
    const agent = new HttpAgent({ host: IC_MAINNET_URL });
    const actor = Actor.createActor(swapBackendIdlFactory, {
      agent,
      canisterId: MAINNET_CANISTER_ID,
    });

    setLoading(true);

    const updateData = (key, value) => {
      setData((prev) => ({ ...prev, [key]: value }));
    };

    actor
      .getLogs()
      .then((logs) => updateData("logs", logs))
      .catch((err) => setError(err.toString()));
    actor
      .getExchangeRate()
      .then((rate) => updateData("exchangeRate", rate.toString()))
      .catch((err) => setError(err.toString()));
    actor
      .getICPBalance()
      .then((balance) => updateData("icpBalance", balance.toString()))
      .catch((err) => setError(err.toString()));
    actor
      .getICPReceived()
      .then((icpReceived) => updateData("icpReceived", icpReceived.toString()))
      .catch((err) => setError(err.toString()));
    actor
      .getTokenBalance()
      .then((tokenBalance) =>
        updateData("tokenBalance", tokenBalance.toString())
      )
      .catch((err) => setError(err.toString()));
    actor
      .getTokenSold()
      .then((tokenSold) => updateData("tokenSold", tokenSold.toString()))
      .catch((err) => setError(err.toString()));

    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [swapBackendIdlFactory]);

  return { data, error, loadingState };
}

export default useAdminData;
