import './App.css';
// import LoadingIndicator from "./components/LoadingIndicator";
import { useState, useEffect } from 'react';


const App = () => {
  const [currentAccount, setCurrentAccount] = useState(null);  
  const [isLoading, setIsLoading] = useState(false);

  const getWalletConnection = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum || true) {
        loginButton.innerText = "MetaMask is not installed"
        loginButton.classList.remove("bg-purple-500", "text-white")
        loginButton.classList.add("bg-gray-500", "text-gray-300", "cursor-not-allowed")
        console.log("MetaMask is not installed");
      }
      else {
        console.log("We have the ethereum object", ethereum);
      }
    }
    catch (error) {
      console.log(error)
    }
  }

  const renderContent = () => {    
    const element = document.createElement('div');
    element.innerHTML = 'Hello webpack !!';

    if (currentAccount) {
      document.getElementById("metamask-connect-button").textContent = "Your Wallet is Connected";
    }
    else {
      document.getElementById("metamask-connect-button").textContent = "Connect Your Wallet :)";
    }
  }

  const loginButton = document.getElementById("login-button")

  function toggleButton() {
    if (!window.ethereum) {
      return false;
    }
    
    loginButton.addEventListener("click", loginMetaMask)
  }

  async function loginMetaMask() {
    const { ethereum } = window;
    const accounts = await ethereum.request({ method: "eth_requestAccounts" });

    if (accounts.length !== 0) {
      const account = accounts[0];
      console.log("Found an authorized account:", account);
      setCurrentAccount(account);
    } else {
      console.log("No authorized account found");
    }
  }

  const connectWalletAction = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }
      
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      
      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);

    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getWalletConnection();
  }, []);

  {renderContent()}
};

export default App;