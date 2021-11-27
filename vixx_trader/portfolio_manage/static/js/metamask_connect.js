const { useState, useEffect } = React;
const fromWei = (_ethBalance) => { return (_ethBalance / 10**18).toFixed(6) };


const App = () => {
  const [currentAccount, setCurrentAccount] = useState(null);

  const setPortfolioValues = (_account, _balance, _opts) => {
    const anchorAddress = document.getElementById("anchor-portfolio-address");
    const ethBalance = document.getElementById("tabledata-portfolio-eth-balance");

    if (_opts) {
      anchorAddress.textContent = _account;
      anchorAddress.href = _opts["href"];
    }
    else {
      anchorAddress.textContent = _account.abbrv;
      anchorAddress.href = _account.href;
    }

    ethBalance.textContent = `${_balance} ETH`;
  }

  const setWalletValues = (_account, _opts) => {   
    if (_opts) {
      document.getElementById("input-address-front").textContent = _account;
      document.getElementById("input-address").value = _opts["value"];

      document.getElementById("img-robohash").src = "";
      document.getElementById("img-robohash").style.display = "none";
    }
    else {
      document.getElementById("input-address-front").textContent = null;
      document.getElementById("input-address-front").appendChild(_account.anchor);
      document.getElementById("input-address").value = _account;

      document.getElementById("img-robohash").src = `https://robohash.org/${_account.address}?set=set3;size=40x40`;
      document.getElementById("img-robohash").style.display = "inline";
    }
  }

  const getWalletConnection = async () => {
    try {
      const { ethereum } = window;
      console.log(ethereum);


      if (!ethereum) {
        alert("Get MetaMask please :)");
        return;
      }

      const eth = new Eth(web3.currentProvider);
      const accounts   = await ethereum.request({ method: "eth_requestAccounts" });
      const weiBalance = await eth.getBalance(accounts[0]);
      const ethBalance = fromWei(parseFloat(weiBalance));
      console.log(eth);

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
        setWalletValues("0x00", {"value": null});
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

