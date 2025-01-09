const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("AIModelMarketplace", function () {
  let AIModelMarketplace;
  let contract;
  let owner, buyer, other;

  beforeEach(async function () {
    // Get signers
    [owner, buyer, other] = await ethers.getSigners();

    // Deploy the contract
    AIModelMarketplace = await ethers.getContractFactory("AIModelMarketplace");
    contract = await AIModelMarketplace.deploy();
    await contract.deployed();
  });

  describe("Listing Models", function () {
    it("Should allow users to list a new model", async function () {
      await expect(
        contract
          .connect(owner)
          .listModel("Model A", "Description A", ethers.utils.parseEther("1"))
      )
        .to.emit(contract, "ModelListed")
        .withArgs(0, owner.address, "Model A", ethers.utils.parseEther("1"));

      const model = await contract.getModelDetails(0);
      expect(model.name).to.equal("Model A");
      expect(model.description).to.equal("Description A");
      expect(model.price).to.equal(ethers.utils.parseEther("1"));
      expect(model.creator).to.equal(owner.address);
    });

    it("Should increment model IDs", async function () {
      await contract
        .connect(owner)
        .listModel("Model A", "Description A", ethers.utils.parseEther("1"));
      await contract
        .connect(owner)
        .listModel("Model B", "Description B", ethers.utils.parseEther("2"));

      const modelA = await contract.getModelDetails(0);
      const modelB = await contract.getModelDetails(1);

      expect(modelA.name).to.equal("Model A");
      expect(modelB.name).to.equal("Model B");
    });
  });

  describe("Purchasing Models", function () {
    beforeEach(async function () {
      await contract
        .connect(owner)
        .listModel("Model A", "Description A", ethers.utils.parseEther("1"));
    });

    it("Should allow users to purchase a model", async function () {
      await expect(
        contract
          .connect(buyer)
          .purchaseModel(0, { value: ethers.utils.parseEther("1") })
      )
        .to.emit(contract, "ModelPurchased")
        .withArgs(0, buyer.address, owner.address);

      const balance = await ethers.provider.getBalance(contract.address);
      expect(balance).to.equal(ethers.utils.parseEther("1"));
    });

    it("Should reject purchases with insufficient funds", async function () {
      await expect(
        contract
          .connect(buyer)
          .purchaseModel(0, { value: ethers.utils.parseEther("0.5") })
      ).to.be.revertedWith("Insufficient payment");
    });
  });

  describe("Rating Models", function () {
    beforeEach(async function () {
      await contract
        .connect(owner)
        .listModel("Model A", "Description A", ethers.utils.parseEther("1"));
      await contract
        .connect(buyer)
        .purchaseModel(0, { value: ethers.utils.parseEther("1") });
    });

    it("Should allow users to rate a purchased model", async function () {
      await expect(contract.connect(buyer).rateModel(0, 5))
        .to.emit(contract, "ModelRated")
        .withArgs(0, buyer.address, 5);

      const model = await contract.getModelDetails(0);
      expect(model.avgRating).to.equal(5);
    });

    it("Should reject ratings from non-buyers", async function () {
      await expect(contract.connect(other).rateModel(0, 5)).to.be.revertedWith(
        "Only buyers can rate"
      );
    });

    it("Should reject invalid ratings", async function () {
      await expect(contract.connect(buyer).rateModel(0, 6)).to.be.revertedWith(
        "Invalid rating"
      );
    });
  });

  describe("Withdrawing Funds", function () {
    beforeEach(async function () {
      await contract
        .connect(owner)
        .listModel("Model A", "Description A", ethers.utils.parseEther("1"));
      await contract
        .connect(buyer)
        .purchaseModel(0, { value: ethers.utils.parseEther("1") });
    });

    it("Should allow contract owner to withdraw funds", async function () {
      const initialBalance = await ethers.provider.getBalance(owner.address);

      await expect(contract.connect(owner).withdrawFunds())
        .to.emit(contract, "FundsWithdrawn")
        .withArgs(owner.address, ethers.utils.parseEther("1"));

      const finalBalance = await ethers.provider.getBalance(owner.address);
      expect(finalBalance).to.be.above(initialBalance);
    });

    it("Should reject withdrawals by non-owners", async function () {
      await expect(contract.connect(other).withdrawFunds()).to.be.revertedWith(
        "Ownable: caller is not the owner"
      );
    });
  });
});
