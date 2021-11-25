
pragma solidity ^0.6;

import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/release-v2.5.0/contracts/token/ERC20/ERC20.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/release-v2.5.0/contracts/token/ERC20/ERC20Detailed.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/release-v2.5.0/contracts/token/ERC20/ERC20Mintable.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/release-v2.5.0/contracts/crowdsale/Crowdsale.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/release-v2.5.0/contracts/crowdsale/emission/MintedCrowdsale.sol";
import "github.com/smartcontractkit/chainlink/evm-contracts/src/v0.6/ChainlinkClient.sol"; 

//token creation 



//token distribution 


//start of chainlink code
//needs parameters specific to VIXM stock ticker 
// MyContract inherits the ChainlinkClient contract to gain the
// functionality of creating Chainlink requests
contract ChainlinkExample is ChainlinkClient {
  // Stores the answer from the Chainlink oracle
  uint256 public currentPrice;
  address public owner;
  
    // The address of an oracle - you can find node addresses on https://market.link/search/nodes
  address ORACLE_ADDRESS = 0xB36d3709e22F7c708348E225b20b13eA546E6D9c;
  // The address of the http get job that returns a uint256 
  // you can find job IDs on https://market.link/search/jobs
  string constant JOBID = "628eded7db7f4f799dbf69538dec7ff2";
  // 1 LINK / 10 = 0.1 LINK
  uint256 constant private ORACLE_PAYMENT = 1 * LINK / 10;

  constructor() public {
    setPublicChainlinkToken();
    owner = msg.sender;
  }

  // Creates a Chainlink request with the uint256 multiplier job
  // Ideally, you'd want to pass the oracle payment, address, and jobID as parameters as well
  // This will return the one day lagged price of whatever ticker you give it
  function requestStockPrice(string memory ticker) 
    public
    onlyOwner
  {
    // newRequest takes a JobID, a callback address, and callback function as input
    Chainlink.Request memory req = buildChainlinkRequest(stringToBytes32(JOBID), address(this), this.fulfill.selector);
    // Adds a URL with the key "get" to the request parameters
    // NOTE, if this chainlink node gets a lot of requests using this API key, it will break (as the API is rate limited)
    req.add("get", string(abi.encodePacked("https://www.alphavantage.co/query?function=GLOBAL_QUOTE&apikey=XXXXXXX&symbol=", ticker)));
    // Uses input param (dot-delimited string) as the "path" in the request parameters
    string[] memory path = new string[](2);
    path[0] = "Global Quote";
    path[1] = "05. price";
    req.addStringArray("path", path);
    // Adds an integer with the key "times" to the request parameters
    req.addInt("times", 100000000);
    // Sends the request with the amount of payment specified to the oracle
    sendChainlinkRequestTo(ORACLE_ADDRESS, req, ORACLE_PAYMENT);
  }

  // fulfill receives a uint256 data type
  function fulfill(bytes32 _requestId, uint256 _price)
    public
    // Use recordChainlinkFulfillment to ensure only the requesting oracle can fulfill
    recordChainlinkFulfillment(_requestId)
  {
    currentPrice = _price;
  }
  
  // withdrawLink allows the owner to withdraw any extra LINK on the contract
  function withdrawLink()
    public
    onlyOwner
  {
    LinkTokenInterface link = LinkTokenInterface(chainlinkTokenAddress());
    require(link.transfer(msg.sender, link.balanceOf(address(this))), "Unable to transfer");
  }
  
  modifier onlyOwner() {
    require(msg.sender == owner);
    _;
  }
  
   // A helper funciton to make the string a bytes32
  function stringToBytes32(string memory source) private pure returns (bytes32 result) {
    bytes memory tempEmptyStringTest = bytes(source);
    if (tempEmptyStringTest.length == 0) {
      return 0x0;
    }
    assembly { // solhint-disable-line no-inline-assembly
      result := mload(add(source, 32))
    }
  }
}
