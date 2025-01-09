require("@nomiclabs/hardhat-ethers");
require("dotenv").config();

module.exports = {
  solidity: "0.8.0",
  networks: {
    ganache: {
      url: "http://127.0.0.1:7545", // Ganache URL
      accounts: [`${process.env.PRIVATE_KEY}`],
    },
  },
};
