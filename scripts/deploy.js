const hre = require("hardhat");

async function main() {
  // Get the deployer's account
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  // Fetch the contract factory
  const AIModelMarketplace = await hre.ethers.getContractFactory(
    "AIModelMarketplace"
  );
  console.log("Contract factory loaded!");

  // Deploy the contract
  const marketplace = await AIModelMarketplace.deploy();
  console.log("Contract deployment transaction sent...");

  // Wait for the contract to be mined
  await marketplace.deployed();
  console.log("AIModelMarketplace deployed to:", marketplace.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
