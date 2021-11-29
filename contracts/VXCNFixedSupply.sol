// SPDX-License-Identifier: MIT
pragma solidity ^0.7.3;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";


contract VXCNFixedSupply is ERC20 {
    constructor() {
        // totalSupply() += 1000;
        // balances[msg.sender] += 1000;
        _mint(msg.sender, 1000);
    }
}

contract VXCNWithMinerREward is ERC20 {
    constructor() ERC20("Reward", "RWD") {}

    function mintMinerReward() {
        _mint(block.coinbase, 1000);
    }
}
