// components/RateModel.js
import React, { useState } from "react";
import { ethers } from "ethers";
import contractABI from "../utils/ABI.json";
import contractAddress from "../utils/contract-address.json";

function RateModel() {
  const [modelId, setModelId] = useState("");
  const [rating, setRating] = useState("");
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

  const handleRate = async (e) => {
    e.preventDefault();
    if (!contract) return;

    try {
      setLoading(true);
      const tx = await contract.rateModel(modelId, rating);
      await tx.wait();
      alert("Model rated successfully!");
    } catch (error) {
      console.error("Error rating model:", error);
      alert("Error rating model. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    initContract();
  }, []);

  return (
    <div>
      <h2>Rate a Model</h2>
      <form onSubmit={handleRate}>
        <input
          type="number"
          placeholder="Model ID"
          value={modelId}
          onChange={(e) => setModelId(e.target.value)}
        />
        <input
          type="number"
          placeholder="Rating (1-5)"
          value={rating}
          onChange={(e) => setRating(e.target.value)}
        />
        <button type="submit" disabled={loading}>
          {loading ? "Rating..." : "Rate Model"}
        </button>
      </form>
    </div>
  );
}

export default RateModel;
