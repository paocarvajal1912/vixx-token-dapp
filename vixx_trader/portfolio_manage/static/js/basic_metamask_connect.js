const { useState, useEffect } = React;
const eth = new Eth(new Eth.HttpProvider('http://localhost:8000'));

const subAddress = (addr, hash_type) => {
  const sub_address = `${addr.substring(0, 5)}...${addr.substring(addr.length-4, addr.length)}`

    // Valid hash_type values are "tx", "address"
    if (hash_type) {
      return `<a href="https://kovan.etherscan.io/${hash_type}/${addr}" target="_blank">${sub_address}</a>`
    }
    else {
      return sub_address
    }
}


const App = () => {
  const [currentAccount, setCurrentAccount] = useState(null);

  const setWalletValues = (_account, _opts) => {
    const publicAddressOut = document.getElementById("out-public-address");

    if (_opts) {
      document.getElementById("public-address").textContent = _account;
      publicAddressOut.value = _account;

      document.getElementById("img-robohash").src = "";
      document.getElementById("img-robohash").style.display = "none";
    }
    else {
      document.getElementById("public-address").textContent = null;
      document.getElementById("public-address").appendChild(_account.anchor);
      publicAddressOut.value = _account.address;

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
      const accounts = await ethereum.request({ method: "eth_requestAccounts" });

      if (currentAccount) {
        return;
      }

      // If new account sign on...
      if (accounts.length !== 0 && accounts[0] !== currentAccount) {
        const account = {
          address: accounts[0],
          href:    subAddress(accounts[0], "address"),
          target:  "_blank",
          name:    "public_address_front",
          abbrv:   subAddress(accounts[0], null),
          anchor:  document.createElement("a")
        };
        
        account.anchor.href        = account.href;
        account.anchor.target      = account.target;
        account.anchor.name        = account.name;
        account.anchor.textContent = account.abbrv;

        setCurrentAccount(account.address);
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

