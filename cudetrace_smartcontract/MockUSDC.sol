// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MockUSDC is ERC20 {
    constructor() ERC20("Mock USDC", "mUSDC") {
        // Mints 100 Billion tokens (with 18 decimal places) to whoever deploys the contract
        _mint(msg.sender, 100000000000 * 10 ** decimals());
    }
}