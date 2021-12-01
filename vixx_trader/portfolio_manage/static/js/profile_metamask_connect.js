const { useState, useEffect } = React;
const eth = new Eth(new Eth.HttpProvider('http://localhost:8000'));
const { ethers } = ethers;


const App = () => {
  const [currentAccount, setCurrentAccount] = useState(null);
  
  const setContractValues = async () => {
    const { ethereum } = window;
    if (!ethereum.selectedAddress) { return }

    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const rateDisplay = document.getElementById("current-market-value")

    const vxcnTokenContract = new ethers.Contract(
      VixcoinToken._contractAddress,
      VixcoinToken.abi,
      signer
    );

    const vxcnTokenCrowdsaleContract = new ethers.Contract(
      VixcoinTokenCrowdsale._contractAddress,
      VixcoinTokenCrowdsale.abi,
      signer
    );

    console.log(signer);
    console.log(ethers);
    console.log("vxcnTokenContract: ", vxcnTokenContract);
    console.log("vxcnTokenCrowdsaleContract: ", vxcnTokenCrowdsaleContract);

    const name   = await vxcnTokenContract.name();
    const symbol = await vxcnTokenContract.symbol();
    const rate   = await vxcnTokenCrowdsaleContract.rate();
    rateDisplay.textContent = `VXCN Current Exchange Rate: ${parseInt(Number(rate), 10)} wei`

    setCookie("tokenName", name, 364);
    setCookie("tokenSymbol", symbol, 364);
    setCookie("tokenRate", rate, 364);
    setCookie("tokenContractAddress", VixcoinToken._contractAddress, 364);
    setCookie("crowdsaleContractAddress", VixcoinTokenCrowdsale._contractAddress, 364);
  }

  const setPortfolioValues = (_balance) => {
    const ethBalance = document.getElementById("tabledata-profile-eth-balance");
    ethBalance.textContent = `${_balance}`;
  }

  const setWalletValues = (_account, _opts) => {   
    if (_opts) {
      document.getElementById("public-address").textContent = _account;
      document.getElementById("page-title").textContent = "Profile Page";

      document.getElementById("img-robohash").src = "";
      document.getElementById("img-robohash").style.display = "none";
    }
    else {
      document.getElementById("public-address").textContent = null;
      document.getElementById("public-address").appendChild(_account.anchor);
      document.getElementById("page-title").appendChild(_account.profile_str);

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

      if (currentAccount) {
        return;
      }

      // If new account sign on...
      if (accounts.length !== 0 && accounts[0] !== currentAccount) {
        const account = {
          address:     accounts[0],
          href:        subAddress(accounts[0], "address"),
          target:      "_blank",
          name:        "public_address_front",
          abbrv:       subAddress(accounts[0], null),
          anchor:      document.createElement("a"),
          profile_str: document.createElement("span")
        };
        
        account.anchor.href        = account.href;
        account.anchor.target      = account.target;
        account.anchor.name        = account.name;
        account.anchor.textContent = account.abbrv;

        account.profile_str.innerHTML = `${account.href}'s Profile`;

        setCurrentAccount(account.address);
        setPortfolioValues(ethBalance);
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
      const currentUrl = window.location.href;

      // If new account sign on...
      if (accounts.length !== 0 && accounts[0] !== currentAccount) {
        const eth = new Eth(web3.currentProvider);
        const ethAccounts = await ethereum.request({ method: "eth_requestAccounts" });
        const weiBalance = await eth.getBalance(ethAccounts[0]);
        const ethBalance = Eth.fromWei(weiBalance, 'ether');
        const newUrl = `http://localhost:8000/mypage/?id=${accounts[0]}`;

        getWalletConnection();

        // Need to refresh page with new url to exercise Django view
        if (currentUrl !== newUrl) {
          window.open(newUrl, "_top");
        }
        
        setCookie("publicAddress", accounts[0], 364)
        setCookie("ethBalance", ethBalance, 364)
      }
      // If no account...
      else if (accounts.length === 0) {
        const newUrl = `http://localhost:8000/mypage/?id=${noAccountAddress}`;
       
        setCurrentAccount(null);
        setPortfolioValues(0.00);
        setWalletValues(noAccountAddress, {"value": null});

        // Need to refresh page with new url to exercise Django view
        if (currentUrl !== newUrl) {
          window.open(newUrl, "_top");
        }

        setCookie("publicAddress", noAccountAddress, 364)
        setCookie("ethBalance", "0", 364)
      }
    }
    catch(error) {
      console.log(error);
    }
  }

  ethereum.on('accountsChanged', getWalletStatus);
  ethereum.on('chainChanged', getWalletStatus);
  setContractValues();
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

