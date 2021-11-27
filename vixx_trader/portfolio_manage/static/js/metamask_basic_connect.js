const { useState, useEffect } = React;
const fromWei = (_ethBalance) => { return (_ethBalance / 10**18).toFixed(6) };


const App = () => {
  const [currentAccount, setCurrentAccount] = useState(null);

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
      console.log(ethBalance);

      if (currentAccount) {
        return;
      }

      // If new account sign on...
      if (accounts.length !== 0 && accounts[0] !== currentAccount) {
        setCurrentAccount(account.address);
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

