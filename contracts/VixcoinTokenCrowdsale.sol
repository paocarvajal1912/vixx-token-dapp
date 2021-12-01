// SPDX-License-Identifier: MIT
pragma solidity ^0.5.0;

import "./VixcoinToken.sol";
import "@openzeppelin/contracts/crowdsale/Crowdsale.sol";


contract VixcoinTokenCrowdsale is Crowdsale {
    constructor(uint256 _rate, address payable _wallet, VixcoinToken _token)
        Crowdsale(_rate, _wallet, _token)
        public
    {
        
    }
}