// components/ListModel.js
import React, { useState } from "react";
import { ethers } from "ethers";
import contractABI from "../utils/ABI.json";
import contractAddress from "../utils/contract-address.json";

function ListModel() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [loading, setLoading] = useState(false);
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);

  // Initialize Web3 and contract
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

  // Add model to marketplace
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!contract) return;

    try {
      setLoading(true);
      const priceInWei = ethers.utils.parseEther(price);
      const tx = await contract.listModel(name, description, priceInWei);
      await tx.wait();
      alert("Model listed successfully!");
    } catch (error) {
      console.error("Error listing model:", error);
      alert("Error adding model. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  // Call initContract on mount
  React.useEffect(() => {
    initContract();
  }, []);

  return (
    <div>
      <h2>Add a New Model</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Model Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <input
          type="number"
          placeholder="Price in ETH"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
        <button type="submit" disabled={loading}>
          {loading ? "Submitting..." : "Add Model"}
        </button>
      </form>
    </div>
  );
}

export default ListModel;
