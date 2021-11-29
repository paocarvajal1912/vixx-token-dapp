const { useState, useEffect } = React;
const eth = new Eth(new Eth.HttpProvider('http://localhost:8000'));


// class TransactionChecker {
//     constructor(address) {
//         this.address = address.toLowerCase();
// }

// async checkBlock() {

//   }
// }

//  var transactionChecker = new  TransactionChecker('0x69fb2a80542721682bfe8daa8fee847cddd1a267');
//  transactionChecker.checkBlock();


const App = () => {
  const [currentAccount, setCurrentAccount] = useState(null);

  const setPortfolioValues = (_account, _balance, _opts) => {
    const anchorAddress = document.getElementById("anchor-portfolio-address");
    const ethBalance = document.getElementById("tabledata-portfolio-eth-balance");
    const publicAddressOut = document.getElementById("out-public-address");
    const ethBalanceOut = document.getElementById("out-eth-balance");

    if (_opts) {
      anchorAddress.textContent = _account;
      anchorAddress.href = _opts["href"];
    }
    else {
      anchorAddress.textContent = _account.abbrv;
      anchorAddress.href = _account.href;
      publicAddressOut.value = _account.address;
      ethBalanceOut.value = _balance;
      console.log(_account.address)
    }

    ethBalance.textContent = `${_balance}`;
  }

  const setWalletValues = (_account, _opts) => {   
    if (_opts) {
      document.getElementById("public-address").textContent = _account;

      document.getElementById("img-robohash").src = "";
      document.getElementById("img-robohash").style.display = "none";
    }
    else {
      document.getElementById("public-address").textContent = null;
      document.getElementById("public-address").appendChild(_account.anchor);

      document.getElementById("img-robohash").src = `https://robohash.org/${_account.address}?set=set3;size=40x40`;
      document.getElementById("img-robohash").style.display = "inline";
    }
  }

  const getWalletConnection = async () => {
    try {
      const { ethereum } = window;
      if (!ethereum) {
        alert("Get MetaMask please :)");
        return;
      }

      const eth = new Eth(web3.currentProvider);
      const accounts   = await ethereum.request({ method: "eth_requestAccounts" });
      const weiBalance = await eth.getBalance(accounts[0]);
      const ethBalance = Eth.fromWei(weiBalance, 'ether');
      // console.log(eth);
      
      let block = await eth.getBlockByNumber("28575746", true);
      let number = block.number;
      let transactions = block.transactions;

      if (block != null && block.transactions != null) {
        for (let txHash of block.transactions) {
          let tx = await eth.getTransactionByHash(txHash.hash);
          if (accounts[0] == tx.from.toLowerCase()) {
            console.log("from: " + tx.from.toLowerCase() + " to: " + tx.to.toLowerCase() + " value: " + tx.value);
          }
        }
      }

      const thisABI = [
        {
          "constant": false,
          "inputs": [
            {
              "name": "_amount",
              "type": "uint256"
            },
            {
              "name": "_recipient",
              "type": "address"
            }
          ],
          "name": "withdraw",
          "outputs": [],
          "payable": false,
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "constant": false,
          "inputs": [],
          "name": "deposit",
          "outputs": [],
          "payable": true,
          "stateMutability": "payable",
          "type": "function"
        },
        {
          "payable": true,
          "stateMutability": "payable",
          "type": "fallback"
        }
      ];

      const thing = await eth.contract(thisABI).at("0x64C172F084f56E15Fc3410869e9641172aEEb5E8");
      // console.log(thing.totalSupply)

      if (currentAccount) {
        return;
      }

      // If new account sign on...
      if (accounts.length !== 0 && accounts[0] !== currentAccount) {
        const account = {
          address: accounts[0],
          href:    `https://kovan.etherscan.io/address/${accounts[0]}`,
          target:  "_blank",
          name:    "public_address_front",
          abbrv:   `${accounts[0].substring(0, 5)}...${accounts[0].substring(accounts[0].length-4, accounts[0].length)}`,
          anchor:  document.createElement("a")
        };
        
        account.anchor.href        = account.href;
        account.anchor.target      = account.target;
        account.anchor.name        = account.name;
        account.anchor.textContent = account.abbrv;

        setCurrentAccount(account.address);
        setPortfolioValues(account, ethBalance);
        setWalletValues(account);
      }
    }
    catch (error) {
      if (error.code === 4001) {
        console.log("Please connect to MetaMask.");
      }
      else {
        console.log(error);
      }
    }
  };

  const setWalletConnection = async () => {
    try {
      const { ethereum } = window;      

      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }

      await ethereum.request({ method: "eth_requestAccounts" });
    }
    catch (error) {
      if (error.code === 4001) {
        console.log("Please connect to MetaMask.");
      }
      else {
        console.log(error);
      }
    }
  };

  const getWalletStatus = async () => {
    try {
      const { ethereum } = window;

      const accounts = await ethereum.request({ method: "eth_accounts" });

      // If new account sign on...
      if (accounts.length !== 0 && accounts[0] !== currentAccount) {
        getWalletConnection();
        return;
      }
      // If no account...
      else if (accounts.length === 0) {        
        setCurrentAccount(null);
        setPortfolioValues(" ", 0.00, {"href": ""});
        setWalletValues("0x00...", {"value": null});
      }
    }
    catch(error) {
      console.log(error);
    }
  }

  ethereum.on('accountsChanged', getWalletStatus);
  ethereum.on('chainChanged', getWalletStatus);
  getWalletStatus();

  
  if (!currentAccount) {
    return (
      <button id="button-metamask" className="button-metamask" style={{ cursor: "pointer" }} onClick={setWalletConnection}>
        Connect Wallet
      </button>
    );
  }
  else {
    return (
      <button id="button-metamask" className="button-metamask" style={{ cursor: "not-allowed" }} onClick={setWalletConnection} disabled>
        Connect Wallet
      </button>
    );
  };
}

const domContainer = document.getElementById('container-button-metamask');
ReactDOM.render(<App />, domContainer);

