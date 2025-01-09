// components/WithdrawFunds.js
import React, { useState } from "react";
import { ethers } from "ethers";
import contractABI from "../utils/ABI.json";
import contractAddress from "../utils/contract-address.json";

function WithdrawFunds() {
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

  const handleWithdraw = async () => {
    if (!contract) return;

    try {
      setLoading(true);
      const tx = await contract.withdrawFunds();
      await tx.wait();
      alert("Funds withdrawn successfully!");
    } catch (error) {
      console.error("Error withdrawing funds:", error);
      alert("Error withdrawing funds. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    initContract();
  }, []);

  return (
    <div>
      <h2>Withdraw Funds</h2>
      <button onClick={handleWithdraw} disabled={loading}>
        {loading ? "Withdrawing..." : "Withdraw Funds"}
      </button>
    </div>
  );
}

export default WithdrawFunds;
