import React from "react";
import ListModel from "./components/ListModel";
import PurchaseModel from "./components/PurchaseModel";
import RateModel from "./components/RateModel";
import ModelDetails from "./components/ModelDetails";
import WithdrawFunds from "./components/WithdrawFunds";
import ListModels from "./components/ListModels";

function App() {
  return (
    <div>
      <h1>AI Model Marketplace</h1>
      <ListModel />
      <PurchaseModel />
      <RateModel />
      <ModelDetails />
      <WithdrawFunds />
      <ListModels />
    </div>
  );
}

export default App;
