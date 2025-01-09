// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract AIModelMarketplace {
    address public owner;
    
    struct Model {
        string name;
        string description;
        uint256 price;
        address payable creator;
        uint256 totalRatings; // Changed from uint8 to prevent overflow
        uint256 numRatings;   // Changed from uint8 to prevent overflow
        uint256 modelCount;
        mapping(address => bool) hasRated; // Add rating tracking
        mapping(address => bool) hasPurchased; // Add purchase tracking
    }

    mapping(uint256 => Model) public models;
    uint256 public modelCount;
    
    event ModelListed(uint256 indexed modelId, address indexed creator, uint256 price);
    event ModelPurchased(uint256 indexed modelId, address indexed buyer, uint256 price);
    event ModelRated(uint256 indexed modelId, address indexed rater, uint8 rating);
    
    constructor() {
        owner = msg.sender;
    }
    
    function listModel(string memory name, string memory description, uint256 price) public {
        require(bytes(name).length > 0, "Name cannot be empty");
        require(bytes(description).length > 0, "Description cannot be empty");
        require(price > 0, "Price must be greater than zero");
        
        Model storage newModel = models[modelCount];
        newModel.name = name;
        newModel.description = description;
        newModel.price = price;
        newModel.creator = payable(msg.sender);
        newModel.totalRatings = 0;
        newModel.numRatings = 0;
        
        emit ModelListed(modelCount, msg.sender, price);
        modelCount++;
    }
    
    function purchaseModel(uint256 modelId) public payable {
        require(modelId < modelCount, "Model does not exist");
        Model storage model = models[modelId];
        require(msg.sender != model.creator, "Cannot purchase your own model");
        require(!model.hasPurchased[msg.sender], "Already purchased this model");
        require(msg.value == model.price, "Incorrect payment amount");
        
        model.hasPurchased[msg.sender] = true;
        model.creator.transfer(msg.value);
        
        emit ModelPurchased(modelId, msg.sender, msg.value);
    }
    
    function rateModel(uint256 modelId, uint8 rating) public {
        require(modelId < modelCount, "Model does not exist");
        require(rating >= 1 && rating <= 5, "Rating must be between 1 and 5");
        Model storage model = models[modelId];
        require(model.hasPurchased[msg.sender], "Must purchase before rating");
        require(!model.hasRated[msg.sender], "Already rated this model");
        
        model.hasRated[msg.sender] = true;
        model.totalRatings += rating;
        model.numRatings++;
        
        emit ModelRated(modelId, msg.sender, rating);
    }
    
    function getModelDetails(uint256 modelId) public view returns (
        string memory name,
        string memory description,
        uint256 price,
        address creator,
        uint256 avgRating
    ) {
        require(modelId < modelCount, "Model does not exist");
        Model storage model = models[modelId];
        avgRating = model.numRatings == 0 ? 0 : model.totalRatings / model.numRatings;
        return (model.name, model.description, model.price, model.creator, avgRating);
    }
    
    function getModelCount() public view returns (uint256) {
        return modelCount;
    }
    
    function withdrawFunds() public {
        require(msg.sender == owner, "Only owner can withdraw");
        uint256 balance = address(this).balance;
        require(balance > 0, "No funds to withdraw");
        payable(owner).transfer(balance);
    }
}