
pragma solidity ^0.5.0;

import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/release-v2.5.0/contracts/token/ERC20/ERC20.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/release-v2.5.0/contracts/token/ERC20/ERC20Detailed.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/release-v2.5.0/contracts/token/ERC20/ERC20Mintable.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/release-v2.5.0/contracts/token/ERC20/ERC20Capped.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/release-v2.5.0/contracts/token/ERC20/IERC20.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/release-v2.5.0/contracts/token/ERC20/ERC20Pausable.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/release-v2.5.0/contracts/ownership/Ownable.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/release-v2.5.0/contracts/math/SafeMath.sol";



//srini please break up code into separate files
//still need to check code for accuracy 
//need to make token price based on performance 
//check if users can buy and sell token
//when users buy token it is in USD and not ether
//need chainlink integration. node runs on computer locally. not sure if contract owner needs libraries installed on their own machine to deploy chainlink portion of contract 

//token_price_today = token price yesterday*(1+vixm_return_yesterday*signal_hat_yesterday) - in USD 


//only deployer can mint tokens
//set cap of tokens at 10000000
contract VixCoin is ERC20, ERC20Detailed, ERC20Mintable, ERC20Capable {
    constructor(
        string memory name,
        string memory symbol,
        uint initial_supply
    )
        ERC20Detailed(VixCoin, VIX, 18)
        public
    {
        //only deployer can mint tokens
        mint(msg.sender, initial_supply);
    }

//only owner can mint new tokens and transfer ownership
//contact owner is the one who deploys
//owner can transfer contract to another
contract VixCoin is Ownable {
    constructor(

    )




}


// set token price 

contract VixCoin {
    using SafeMath for uint;

    address payable owner = msg.sender;
    string public symbol = "VIX";

    //token price should not be public and should update daily
    //token price is cost of token
    //only owner can update 

    uint token_price = ;
    mapping(address => uint) balances;

    function balance() public view returns(uint) {
        return balances[msg.sender];
    }

    //transfer tokens between users 
    function transfer(address recipient, uint value) public {
        balances[msg.sender] = balances[msg.sender].sub(value);
        balances[recipient] = balances[recipient].add(value);
    }

    function purchase() public payable {
        uint amount = msg.value.mul(exchange_rate);
        balances[msg.sender] = balances[msg.sender].add(amount);
        owner.transfer(msg.value);
    }

    //user log of buy and sell?
    function log()

    function mint(address recipient, uint value) public {
        require(msg.sender == owner, "You can not mint tokens!");
        balances[recipient] = balances[recipient].add(value);
    }
}




