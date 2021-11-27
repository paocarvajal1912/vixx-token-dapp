pragma solidity ^0.5.0;

//FIX CHAINLINK INTEGRATION
import "./vix_token_creation.sol";
import "@chainlink/contracts/src/v0.5/KeeperCompatibleInterface.sol";

/start of chainlink code
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

 function requestVolumeData() public returns (bytes32 requestId) 
    {
        Chainlink.Request memory request = buildChainlinkRequest(jobId, address(this), this.fulfill.selector);
        // Set the URL to perform the GET request on
        request.add("get", "https://min-api.cryptocompare.com/data/pricemultifull?fsyms=ETH&tsyms=USD");
        // Set the path to find the desired data in the API response, where the response format is:
        // {"RAW":
        //   {"ETH":
        //    {"USD":
        //     {
        //      "VOLUME24HOUR": xxx.xxx,
        //     }
        //    }
        //   }
        //  }
        request.add("path", "RAW.ETH.USD.VOLUME24HOUR");
        // Multiply the result by 1000000000000000000 to remove decimals
        int timesAmount = 10**18;
        request.addInt("times", timesAmount);
        // Sends the request
        return sendChainlinkRequestTo(oracle, request, fee);
    }
    
    /**
     * Receive the response in the form of uint256
     */ 
    function fulfill(bytes32 _requestId, uint256 _volume) public recordChainlinkFulfillment(_requestId)
    {
        volume = _volume;
    }
    // function withdrawLink() external {} - Implement a withdraw function to avoid locking your LINK in the contract
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
