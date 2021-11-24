pragma solidity ^0.5.5;


import "./vix_token.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/release-v2.5.0/contracts/crowdsale/Crowdsale.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/release-v2.5.0/contracts/crowdsale/emission/MintedCrowdsale.sol"

contract VIXCOIN is ERC20, ERC20Detailed {
    constructor(uint256 initialSupply) ERC20Detailed("VIX) public {
        _mint(msg.sender, initialSupply);
        _
    }
}

function decimals() public view virtual override returns (uint8) {
  return 18;
}