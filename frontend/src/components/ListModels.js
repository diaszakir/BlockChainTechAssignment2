// components/ListModels.js
import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import contractABI from "../utils/ABI.json";
import contractAddress from "../utils/contract-address.json";

function ListModels() {
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(false);
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
      setContract(marketplaceContract);
    } else {
      alert("Please install MetaMask!");
    }
  };

  // Fetch models from the contract
  const fetchModels = async () => {
    if (!contract) return;
    try {
      setLoading(true);
      const modelCount = await contract.getModelCount();
      const fetchedModels = [];
      for (let i = 1; i <= modelCount; i++) {
        const model = await contract.getModelDetails(i);
        fetchedModels.push({
          id: i,
          name: model.name,
          description: model.description,
          price: ethers.utils.formatEther(model.price),
          creator: model.creator,
          rating: model.rating,
        });
      }
      setModels(fetchedModels);
    } catch (error) {
      console.error("Error fetching models:", error);
      alert("Error fetching models. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  // Initialize contract and fetch models only once on component mount
  useEffect(() => {
    initContract();
  }, []); // Запустится только один раз

  // Fetch models only when contract is initialized
  useEffect(() => {
    if (contract) {
      fetchModels();
    }
  }, [contract]); // Запустится только если contract изменится (в первый раз)

  return (
    <div>
      <h2>Models List</h2>
      {loading ? (
        <p>Loading models...</p>
      ) : (
        <div>
          {models.length > 0 ? (
            models.map((model) => (
              <div key={model.id}>
                <h3>{model.name}</h3>
                <p>{model.description}</p>
                <p>Price: {model.price} ETH</p>
                <p>Creator: {model.creator}</p>
                <p>Rating: {model.rating}/5</p>
              </div>
            ))
          ) : (
            <p>No models available.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default ListModels;
