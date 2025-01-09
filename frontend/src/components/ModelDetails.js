// components/ModelDetails.js
import React, { useState } from "react";
import { ethers } from "ethers";
import contractABI from "../utils/ABI.json";
import contractAddress from "../utils/contract-address.json";

function ModelDetails() {
  const [modelId, setModelId] = useState("");
  const [model, setModel] = useState(null);
  const [loading, setLoading] = useState(false);
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);

  const initContract = async () => {
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const marketplaceContract = new ethers.Contract(
        contractAddress.AIModelMarketplace,
        contractABI,
        signer
      );
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      setAccount(accounts[0]);
      setContract(marketplaceContract);
    } else {
      alert("Please install MetaMask!");
    }
  };

  const fetchModelDetails = async (e) => {
    e.preventDefault();
    if (!contract) return;

    try {
      setLoading(true);
      const modelDetails = await contract.getModelDetails(modelId);
      setModel(modelDetails);
    } catch (error) {
      console.error("Error fetching model details:", error);
      alert("Error fetching model details. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    initContract();
  }, []);

  return (
    <div>
      <h2>Model Details</h2>
      <form onSubmit={fetchModelDetails}>
        <input
          type="number"
          placeholder="Model ID"
          value={modelId}
          onChange={(e) => setModelId(e.target.value)}
        />
        <button type="submit" disabled={loading}>
          {loading ? "Fetching..." : "Get Model Details"}
        </button>
      </form>

      {model && (
        <div>
          <h3>{model[0]}</h3>
          <p>{model[1]}</p>
          <p>Price: {ethers.utils.formatEther(model[2])} ETH</p>
        </div>
      )}
    </div>
  );
}

export default ModelDetails;
