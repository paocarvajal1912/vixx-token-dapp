// SPDX-License-Identifier: MIT
pragma solidity ^0.7.3;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";


contract VXCNToken is ERC20 {
    constructor(uint256 intitialSuppy) ERC20("Vixcoin", "VXCN") {
        _mint(msg.sender, intitlaSupply);
    }

    function decimals() public view virtual override returns(uint8) {
        return 16;
    }
}