// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract CrudeTrace is AccessControl, ReentrancyGuard, Pausable {
    // --- Roles ---
    bytes32 public constant WELLHEAD_ORACLE = keccak256("WELLHEAD_ORACLE");
    bytes32 public constant TERMINAL_ORACLE = keccak256("TERMINAL_ORACLE");
    bytes32 public constant AUTOMATION_ROLE = keccak256("AUTOMATION_ROLE"); // For Kwala actions

    // --- State Variables ---
    IERC20 public paymentToken; // e.g., Mock USDC address
    uint256 public acceptableLossBasisPoints = 50; // 0.5% acceptable loss (evaporation)
    
    // Royalty Distribution Wallets & Percentages (Basis Points: 10000 = 100%)
    address public federalWallet;
    address public stateWallet;
    address public communityTrustWallet;
    
    uint256 public constant FED_SHARE = 5000; // 50%
    uint256 public constant STATE_SHARE = 3000; // 30%
    uint256 public constant COMMUNITY_SHARE = 2000; // 20%

    // --- Data Structures ---
    enum BatchStatus { PENDING, IN_TRANSIT, DELIVERED, DISCREPANCY_FLAGGED, SETTLED }

    struct OilBatch {
        uint256 volumeLoaded;
        uint256 volumeDelivered;
        uint256 timestampLoaded;
        uint256 timestampDelivered;
        uint256 batchValue; // Value in mock USD
        BatchStatus status;
    }

    mapping(uint256 => OilBatch) public batches;

    // --- Events (Crucial for Kwala Triggers) ---
    event BatchExtracted(uint256 indexed batchId, uint256 volume, uint256 value);
    event DeliveryConfirmed(uint256 indexed batchId, uint256 volumeDelivered);
    event TheftAlert(uint256 indexed batchId, uint256 volumeLost, string message);
    event RoyaltiesDistributed(uint256 indexed batchId, uint256 totalAmount);

    constructor(
        address _tokenAddress, 
        address _federal, 
        address _state, 
        address _community
    ) {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        paymentToken = IERC20(_tokenAddress);
        federalWallet = _federal;
        stateWallet = _state;
        communityTrustWallet = _community;
    }

    // --- Step 1: Log Extraction (Triggered by IoT/Wellhead) ---
    function logExtraction(uint256 _batchId, uint256 _volumeLoaded, uint256 _batchValue) 
        external 
        onlyRole(WELLHEAD_ORACLE) 
        whenNotPaused 
    {
        require(batches[_batchId].timestampLoaded == 0, "Batch ID already exists");

        batches[_batchId] = OilBatch({
            volumeLoaded: _volumeLoaded,
            volumeDelivered: 0,
            timestampLoaded: block.timestamp,
            timestampDelivered: 0,
            batchValue: _batchValue,
            status: BatchStatus.IN_TRANSIT
        });

        emit BatchExtracted(_batchId, _volumeLoaded, _batchValue);
    }

    // --- Step 2: Log Delivery & Check for Theft (Triggered by Terminal) ---
    function logDelivery(uint256 _batchId, uint256 _volumeDelivered) 
        external 
        onlyRole(TERMINAL_ORACLE) 
        whenNotPaused 
    {
        OilBatch storage batch = batches[_batchId];
        require(batch.status == BatchStatus.IN_TRANSIT, "Batch not in transit");

        batch.volumeDelivered = _volumeDelivered;
        batch.timestampDelivered = block.timestamp;

        // Calculate allowed loss
        uint256 allowedLoss = (batch.volumeLoaded * acceptableLossBasisPoints) / 10000;
        uint256 actualLoss = batch.volumeLoaded > _volumeDelivered ? batch.volumeLoaded - _volumeDelivered : 0;

        if (actualLoss > allowedLoss) {
            batch.status = BatchStatus.DISCREPANCY_FLAGGED;
            // Kwala listens for this to send an SMS/Email to authorities
            emit TheftAlert(_batchId, actualLoss, "Significant volume drop detected in transit.");
        } else {
            batch.status = BatchStatus.DELIVERED;
            // Kwala listens for this to trigger the payout function below
            emit DeliveryConfirmed(_batchId, _volumeDelivered);
        }
    }

    // --- Step 3: Distribute Funds (Triggered by Kwala Action) ---
    function distributeRoyalties(uint256 _batchId) 
        external 
        onlyRole(AUTOMATION_ROLE) 
        nonReentrant 
        whenNotPaused 
    {
        OilBatch storage batch = batches[_batchId];
        require(batch.status == BatchStatus.DELIVERED, "Batch not cleared for settlement");

        uint256 totalValue = batch.batchValue;
        batch.status = BatchStatus.SETTLED;

        // Ensure the contract holds enough mock USDC (funded by buyers/treasury)
        require(paymentToken.balanceOf(address(this)) >= totalValue, "Insufficient treasury funds");

        // Calculate shares
        uint256 fedAmount = (totalValue * FED_SHARE) / 10000;
        uint256 stateAmount = (totalValue * STATE_SHARE) / 10000;
        uint256 communityAmount = (totalValue * COMMUNITY_SHARE) / 10000;

        // Execute transfers
        paymentToken.transfer(federalWallet, fedAmount);
        paymentToken.transfer(stateWallet, stateAmount);
        paymentToken.transfer(communityTrustWallet, communityAmount);

        emit RoyaltiesDistributed(_batchId, totalValue);
    }
    
    // --- Admin Functions ---
    function pause() external onlyRole(DEFAULT_ADMIN_ROLE) { _pause(); }
    function unpause() external onlyRole(DEFAULT_ADMIN_ROLE) { _unpause(); }
    
    // Function to grant admin access to another address (for testing purposes)
    function grantAdminRole(address account) external onlyRole(DEFAULT_ADMIN_ROLE) {
        grantRole(DEFAULT_ADMIN_ROLE, account);
    }
}