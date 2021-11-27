
pragma solidity ^0.5.0;

import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/release-v2.5.0/contracts/token/ERC20/ERC20.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/release-v2.5.0/contracts/token/ERC20/ERC20Detailed.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/release-v2.5.0/contracts/token/ERC20/ERC20Mintable.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/release-v2.5.0/contracts/math/SafeMath.sol";


//token creation 
//edit the line below for exchange rate 
//initial supply is 10 million tokens 
contract VixCoin is ERC20, ERC20Detailed, ERC20Mintable {
    constructor(
        string memory name,
        string memory symbol,
        uint initial_supply
    )
        ERC20Detailed(VixCoin, VIX, 18)
        public
    {
        mint(msg.sender, initial_supply);
    }

contract VixCoin {
    using SafeMath for uint;

    address payable owner = msg.sender;
    string public symbol = "VIX";

    //exchange rate should not be public and should update daily
    //exchange rate is cost of token
    //only owner can update?

    uint public exchange_rate = ;
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

    //log of exchange rates
    function log()

    function mint(address recipient, uint value) public {
        require(msg.sender == owner, "You can not mint tokens!");
        balances[recipient] = balances[recipient].add(value);
    }
}


