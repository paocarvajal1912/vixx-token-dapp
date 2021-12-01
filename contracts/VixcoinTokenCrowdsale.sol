//SDPX-License-Identifier: MIT
pragma solidity ^0.5.0;

import "./VixcoinToken.sol";
import "hardhat/console.sol";
import "@openzeppelin/contracts/crowdsale/Crowdsale.sol";
import "@openzeppelin/contracts/crowdsale/emission/MintedCrowdsale.sol";


contract VixcoinTokenCrowdsale is Crowdsale, MintedCrowdsale {
    constructor(
        uint _rate,
        address payable _wallet,
        VixcoinToken _token
    )
    Crowdsale(_rate, _wallet, _token)
    public {}
}

contract VixcoinTokenCrowdsaleDeployer {
    address public vixcoin_token_address;
    address public vixcoin_crowdsale_address;

    constructor(
        string memory _name,
        string memory _symbol,
        address payable _wallet
    )
    public
    {
        uint256 _rate = 25;

        // Create the VixcoinToken and keep its address
        VixcoinToken _token = new VixcoinToken(_name, _symbol);
        vixcoin_token_address = address(_token);
        console.log("vixcoin_token_address: ", vixcoin_token_address);

        // Create the VixcoinTokenCrowdsale and tell it about the token
        VixcoinTokenCrowdsale vixcoin_crowdsale = new VixcoinTokenCrowdsale(_rate, _wallet, _token);
        vixcoin_crowdsale_address = address(vixcoin_crowdsale);
        console.log("vixcoin_crowdsale_address: ", vixcoin_crowdsale_address);

        // Make the VixcoinTokenCrowdsale contract a minter,
        // then have the VixcoinTokenCrowdsaleDeployer renounce its minter role.
        _token.addMinter(vixcoin_crowdsale_address);
        _token.renounceMinter();
    }

    function getVixcoinTokenAddress() public view returns(address) {
        return vixcoin_token_address;
    }

    function getVixcoinCrowdsaleAddress() public view returns(address) {
        return vixcoin_crowdsale_address;
    }
}

