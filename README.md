# AI Model Marketplace dApp

## Overview

The AI Model Marketplace is a decentralized application (dApp) that allows users to list, purchase, and rate AI models. The application uses Ethereum smart contracts to handle core marketplace functionality, and the frontend is designed to provide a user-friendly interface for interacting with the contract.

This project is built using **Hardhat** for smart contract development, **Ganache** for local blockchain testing, **MetaMask** for user wallet interaction, **Web3.js** for smart contract interaction on the frontend, and **React** for the frontend application.

## Features

- **List AI Models**: Users can list new AI models by providing a name, description, and price.
- **Purchase Models**: Users can purchase AI models by paying the specified price.
- **Rate Models**: Users can rate the models they've purchased, contributing to the model's overall rating score.
- **Withdraw Funds**: Model creators can withdraw funds accumulated from model sales.
- **View Model Details**: Users can view details of each model, including name, description, price, creator, and average rating.

## Tech Stack

- **Smart Contract**: Solidity (for Ethereum smart contract)
- **Blockchain**: Ethereum (or testnet using Hardhat & Ganache)
- **Frontend**: React.js
- **Blockchain Interaction**: Web3.js
- **Wallet**: MetaMask

## Installation Guide

### Step 1: Install Dependencies

Clone the repository and install dependencies for both the backend (smart contracts) and frontend.

```bash
git clone https://github.com/diaszakir/BlockChainTechAssignment2
cd ai-model-marketplace
npm install --save-dev hardhat
npm install @openzeppelin/contracts
```

### Step 2: Set up Ganache and MetaMask

- Install **Ganache** for creating a local Ethereum blockchain:  
  [Download Ganache](https://www.trufflesuite.com/ganache)
  
- Install **MetaMask** browser extension to interact with the Ethereum network:
  [Download MetaMask](https://metamask.io/)

Make sure Ganache is running on your local machine and MetaMask is connected to the Ganache network.

### Step 3: Deploy the Smart Contract

1. In the `contracts` folder, you'll find the `Marketplace.sol` smart contract. This contract is responsible for managing the marketplace, including listing, purchasing, rating models, and withdrawing funds.

2. To deploy the smart contract, run the following command:

```bash
npx hardhat run scripts/deploy.js --network localhost
```

This will deploy the contract to the local blockchain created by Ganache.

### Step 4: Frontend Setup

1. Navigate to the `frontend` folder:

```bash
cd frontend
npm install
```

2. Start the React app:

```bash
npm start
```

### Step 5: Connect MetaMask

- Ensure your MetaMask wallet is connected to the local Ganache network.
- Click the **Connect to MetaMask** button on the frontend to connect your MetaMask wallet.

### Step 6: Interact with the Marketplace

- **List a Model**: Fill out the form to list a new AI model, including name, description, and price.
- **View Models**: See available models listed in the marketplace with their details.
- **Purchase Models**: Click the "Purchase" button to buy a model.
- **Rate Models**: After purchasing a model, rate it using the "Rate" button.
- **Withdraw Funds**: Model creators can withdraw funds earned from their listed models.

## Smart Contract Functions

The contract includes the following functions:

- `listModel(name, description, price)`: Allows users to list a new AI model.
- `purchaseModel(modelId)`: Allows users to purchase a model by its ID.
- `rateModel(modelId, rating)`: Allows users to rate a purchased model.
- `withdrawFunds()`: Allows the contract owner to withdraw accumulated funds.
- `getModelDetails(modelId)`: Retrieves details of a model, including name, description, price, creator, and average rating.

## Screenshots
![image](https://github.com/user-attachments/assets/3d51748e-569a-4153-8cf5-a684f50d977b)
![image](https://github.com/user-attachments/assets/4052a19d-b307-47fb-ab67-3bdc3bdbdbeb)
![image](https://github.com/user-attachments/assets/83e3bc89-357e-4cac-87e8-f07ffa2e562d)



## Future Improvements

- Deploy the contract to an Ethereum testnet or mainnet.
- Implement additional features such as model categories, searching, or sorting by rating/price.
- Optimize gas usage for contract transactions.
