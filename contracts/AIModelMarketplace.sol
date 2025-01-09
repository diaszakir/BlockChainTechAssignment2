// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract AIModelMarketplace {
    address public owner;
    
    struct Model {
        string name;
        string description;
        uint256 price;
        address creator;
        uint256 rating;
        uint256 ratingCount;
    }

    mapping(uint256 => Model) public models;
    uint256 public modelCount;

    event ModelListed(uint256 modelId, string name, string description, uint256 price, address creator);
    event ModelPurchased(uint256 modelId, address buyer);
    event ModelRated(uint256 modelId, uint256 rating);

    constructor() {
        owner = msg.sender;
    }

    // List a new model on the marketplace
    function listModel(string memory name, string memory description, uint256 price) public {
        modelCount++;
        models[modelCount] = Model(name, description, price, msg.sender, 0, 0);
        emit ModelListed(modelCount, name, description, price, msg.sender);
    }

    // Get details of a model
    function getModelDetails(uint256 modelId) public view returns (Model memory) {
        return models[modelId];
    }

    // Buy a model
    function purchaseModel(uint256 modelId) public payable {
        Model storage model = models[modelId];
        require(msg.value == model.price, "Incorrect price");

        payable(model.creator).transfer(msg.value);
        emit ModelPurchased(modelId, msg.sender);
    }

    // Rate a model
    function rateModel(uint256 modelId, uint256 rating) public {
        Model storage model = models[modelId];
        require(rating >= 1 && rating <= 5, "Rating must be between 1 and 5");

        model.rating = (model.rating * model.ratingCount + rating) / (model.ratingCount + 1);
        model.ratingCount++;

        emit ModelRated(modelId, model.rating);
    }

    // Withdraw funds for the owner
    function withdrawFunds() public {
        require(msg.sender == owner, "Only the owner can withdraw");
        payable(owner).transfer(address(this).balance);
    }

    // Get the total number of models listed
    function getModelCount() public view returns (uint256) {
        return modelCount;
    }
}
