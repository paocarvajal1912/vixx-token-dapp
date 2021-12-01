const { useState, useEffect } = React;
const eth = new Eth(new Eth.HttpProvider('http://localhost:8000'));
const { ethers } = ethers;


const setTableHeader = (tr, hdr) => {
    let th = tr.insertCell();
    th.innerHTML = `<b>${hdr}</b>`;
}

const setTableData = (tr, data) => {
    let td = tr.insertCell();
    td.width = "90px";

    td.innerHTML = data;
}

const App = () => {
  const [currentAccount, setCurrentAccount] = useState(null);

  const setContractValues = async () => {
    const { ethereum } = window;
    if (!ethereum.selectedAddress) { return }

    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();

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
    console.log(vxcnTokenContract);
    console.log(vxcnTokenContract);

    const name   = await vxcnTokenContract.name();
    const symbol = await vxcnTokenContract.symbol();
    const rate   = await vxcnTokenCrowdsaleContract.rate();
    setCookie("tokenName", name, 364);
    setCookie("tokenSymbol", symbol, 364);
    setCookie("tokenRate", rate, 364);
    setCookie("tokenContractAddress", VixcoinToken._contractAddress, 364);
    setCookie("crowdsaleContractAddress", VixcoinTokenCrowdsale._contractAddress, 364);
  }

  const setPortfolioValues = (_account, _balance, _opts) => {
    const anchorAddress = document.getElementById("anchor-portfolio-address");
    const ethBalance    = document.getElementById("tabledata-portfolio-eth-balance");

    // If no account...
    if (_opts) {
      anchorAddress.textContent = _account;
      anchorAddress.href = _opts["href"];
    }
    // If account...
    else {
      anchorAddress.textContent = _account.abbrv;
      anchorAddress.href = _account.href;
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

  const setTransactionTable = (_account) => {
    let transactionTable = document.getElementById("table-transaction-list");

    try {
        console.log(transactionTable.name);
      if (!_account || _account !== transactionTable.name) {
        transactionTable.remove()
        transactionTable = document.getElementById("table-transaction-list");
      }
    }
    catch (error) {};
    
    if (_account && !transactionTable) {
      let tbl         = document.createElement('table');
      tbl.id          = "table-transaction-list";
      tbl.name        = _account;
      tbl.style.width = '950px';

      let header = tbl.createTHead();
      let tr     = header.insertRow(0);

      let sameAccount  = false;
      let sameContract = false;

      setTableHeader(tr, "Transaction")
      setTableHeader(tr, "Date");
      setTableHeader(tr, "Time");
      setTableHeader(tr, "Contract");
      setTableHeader(tr, "From");
      setTableHeader(tr, "To");
      setTableHeader(tr, "Amount (wei)");

      for(let i = 0; i < tx_from.length; i++){
        sameAccount  = (tx_to[i] === _account || tx_from[i] === _account);
        sameContract = tx_contractAddress[i] === contract_address;

        if (sameAccount && sameContract) {
          tr = tbl.insertRow();

          setTableData(tr, subAddress(tx_hash[i], "tx"));
          setTableData(tr, tx_date[i]);
          setTableData(tr, tx_time[i]);
          setTableData(tr, subAddress(tx_contractAddress[i], "address"));
          setTableData(tr, subAddress(tx_from[i], "address"));
          setTableData(tr, subAddress(tx_to[i], "address"));
          setTableData(tr, tx_value[i]);
        }
      }

      document.getElementById('container-transaction-table').appendChild(tbl);
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
      
      let block = await eth.getBlockByNumber("28575746", true);
      let number = block.number;
      let transactions = block.transactions;

      if (block != null && block.transactions != null) {
        for (let txHash of block.transactions) {
          let tx = await eth.getTransactionByHash(txHash.hash);
          if (accounts[0] == tx.from.toLowerCase()) {
            // console.log("from: " + tx.from.toLowerCase() + " to: " + tx.to.toLowerCase() + " value: " + tx.value);
          }
        }
      }

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
        setPortfolioValues(account, ethBalance);
        setWalletValues(account);
        setTransactionTable(account.address);
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
        const newUrl = `http://localhost:8000/portfolio/?id=${accounts[0]}`;

        getWalletConnection();
        setCookie("publicAddress", accounts[0], 364)
        setCookie("ethBalance", ethBalance, 364)

        // Need to refresh page with new url to exercise Django view
        if (currentUrl !== newUrl) {
          window.open(newUrl, "_top");
        }
      }
      // If no account...
      else if (accounts.length === 0) {
        const newUrl = `http://localhost:8000/portfolio/?id=${noAccountAddress}`;
       
        setCurrentAccount(null);
        setPortfolioValues(" ", 0.00, {"href": ""});
        setWalletValues(noAccountAddress, {"value": null});
        setTransactionTable(null);        
        setCookie("publicAddress", noAccountAddress, 364)
        setCookie("ethBalance", "0", 364)

        // Need to refresh page with new url to exercise Django view
        if (currentUrl !== newUrl) {
          window.open(newUrl, "_top");
        }
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

