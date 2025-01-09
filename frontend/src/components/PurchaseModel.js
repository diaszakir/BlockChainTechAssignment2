// components/PurchaseModel.js
import React, { useState } from "react";
import { ethers } from "ethers";
import contractABI from "../utils/ABI.json";
import contractAddress from "../utils/contract-address.json";

function PurchaseModel() {
  const [modelId, setModelId] = useState("");
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

  const handlePurchase = async (e) => {
    e.preventDefault();
    if (!contract) return;

    try {
      setLoading(true);
      const tx = await contract.purchaseModel(modelId, {
        value: ethers.utils.parseEther("1"),
      }); // Пример, для 1 ETH
      await tx.wait();
      alert("Model purchased successfully!");
    } catch (error) {
      console.error("Error purchasing model:", error);
      alert("Error purchasing model. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    initContract();
  }, []);

  return (
    <div>
      <h2>Purchase a Model</h2>
      <form onSubmit={handlePurchase}>
        <input
          type="number"
          placeholder="Model ID"
          value={modelId}
          onChange={(e) => setModelId(e.target.value)}
        />
        <button type="submit" disabled={loading}>
          {loading ? "Purchasing..." : "Purchase Model"}
        </button>
      </form>
    </div>
  );
}

export default PurchaseModel;
