const { useState, useEffect } = React;
const eth = new Eth(new Eth.HttpProvider('http://localhost:8000'));

const sortMeta = (data) => {
    return document.getElementsByName(data)[0].content.split("//s");
}

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

const setTableHeader = (tr, hdr) => {
    let th = tr.insertCell();
    th.innerHTML = `<b>${hdr}</b>`;
}

const setTableData = (tr, data) => {
    let td = tr.insertCell();
    td.width = "90px";

    td.innerHTML = data;
}

const tx_hash            = sortMeta('tx_hash');
const tx_contractAddress = sortMeta('tx_contractAddress');
const tx_from            = sortMeta('tx_from');
const tx_to              = sortMeta('tx_to');
const tx_value           = sortMeta('tx_value');
const tx_gasUsed         = sortMeta('tx_gasUsed');
const tx_date            = sortMeta('tx_date');
const tx_time            = sortMeta('tx_time');


const App = () => {
  const [currentAccount, setCurrentAccount] = useState(null);

  const setPortfolioValues = (_account, _balance, _opts) => {
    const anchorAddress    = document.getElementById("anchor-portfolio-address");
    const ethBalance       = document.getElementById("tabledata-portfolio-eth-balance");
    const publicAddressOut = document.getElementById("out-public-address");
    const ethBalanceOut    = document.getElementById("out-eth-balance");

    if (_opts) {
      anchorAddress.textContent = _account;
      anchorAddress.href = _opts["href"];
    }
    else {
      anchorAddress.textContent = _account.abbrv;
      anchorAddress.href = _account.href;
      publicAddressOut.value = _account.address;
      ethBalanceOut.value = _balance;
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
      if (!_account || _account !== transactionTable.name) {
        transactionTable.remove()
        transactionTable = document.getElementById("table-transaction-list");
      }
    } catch (error) {
      console.log(error);
    };

    console.log(transactionTable);
    if (_account && !transactionTable) {
      console.log(_account)
      let tbl         = document.createElement('table');
      tbl.id          = "table-transaction-list";
      tbl.name        = _account;
      tbl.style.width = '950px';

      let header = tbl.createTHead();
      let tr = header.insertRow(0);

      setTableHeader(tr, "Transaction")
      setTableHeader(tr, "Date");
      setTableHeader(tr, "Time");
      setTableHeader(tr, "Contract");
      setTableHeader(tr, "From");
      setTableHeader(tr, "To");
      setTableHeader(tr, "Amount (wei)");

      for(let i = 0; i < tx_from.length; i++){
        console.log(tx_contractAddress[i])
        if (tx_to[i] !== _account) { continue }

          tr = tbl.insertRow();

          setTableData(tr, subAddress(tx_hash[i], "tx"));
          setTableData(tr, tx_date[i]);
          setTableData(tr, tx_time[i]);
          setTableData(tr, subAddress(tx_contractAddress[i], "address"));
          setTableData(tr, subAddress(tx_from[i], "address"));
          setTableData(tr, subAddress(tx_to[i], "address"));
          setTableData(tr, tx_value[i]);
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
        setTransactionTable(null);
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

