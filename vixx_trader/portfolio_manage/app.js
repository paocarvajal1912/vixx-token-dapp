import React, { useEffect, useState } from 'react';
import twitterLogo from './assets/twitter-logo.svg';
import './App.css';
import SelectCharacter from "./Components/SelectCharacter";
import Arena from "./Components/Arena";
import { CONTRACT_ADDRESS, transformCharacterData } from "./constants";
import myEpicGame from "./utils/MyEpicGame.json";
import { ethers } from "ethers";
import LoadingIndicator from "./Components/LoadingIndicator";

// Constants
const TWITTER_HANDLE = '_buildspace';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

const App = () => {
  /*
  * Just a state variable we use to store our user's public wallet.
  */
  const [currentAccount, setCurrentAccount] = useState(null);
  const [characterNFT, setCharacterNFT] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  /*
  * Start by creating a new action that we will run on component load
  */
  // Actions
  const checkIfWalletIsConnected = async () => {
    try {
      /*
      * First make sure we have access to window.ethereum
      */
      const { ethereum } = window;

      if (!ethereum) {
        console.log("Make sure you have MetaMask!")
        return;
      } else {
        console.log("We have the ethereum object", ethereum)
      }

      /*
      * Check if we're authorized to access the user's wallet
      */
      const accounts = await ethereum.request({ method: "eth_accounts" });

      /*
      * User can have multiple authorized accounts, we grab the first one
      * if its there!
      */
      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("Found an authorized account:", account);
        setCurrentAccount(account);
      } else {
        console.log("No authorized account found");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return <LoadingIndicator />;
    }
    
    /*
     * Scenario #1
     */
    if (!currentAccount) {
      return (
        <div className="body-container">
          <div className="iframe-container">
            <iframe src="https://gifer.com/embed/NKaU" width="750" height="400" frameBorder="0" allowFullScreen></iframe>
          </div>

          <div className="connect-wallet-container">
            {/*
              * Button that we will use to trigger wallet connect
              */}
            <button className="cta-button connect-wallet-button" onClick={connectWalletAction}>Connect Wallet To Get Started</button>
          </div>
        </div>
      );

      /*
       * Scenario #2
       */
    } else if (currentAccount && !characterNFT || characterNFT.hp === 0) {
      return <SelectCharacter setCharacterNFT={setCharacterNFT} />
    } else if (currentAccount && characterNFT) {
      return <Arena characterNFT={characterNFT} setCharacterNFT={setCharacterNFT}/>
    }
  };

  const renderSubtitle = () => {
    /*
     * Scenario #1
     */
    if (!currentAccount) {
      return (
        <h3>Team up to protect the Metaverse!</h3>
      );

      /*
       * Scenario #2
       */
    } else if (currentAccount && !characterNFT) {
      return (
        <h3>Mint Your Hero. Choose Wisely!</h3>
      )
    }
  };

  /*
   * Implement your connectWallet method here
   */
  const connectWalletAction = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }

      /*
       * Fancy method to request access to account.
       */
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      /*
       * Boom! This should print out public address once we authorize MetaMask.
       */
      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);

    } catch (error) {
      console.log(error);
    }
  }

  /*
   * This runs our function when the page loads.
   */
  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  useEffect(() => {
    /*
     * The function we will call that interacts with our smart contract
     */
    const fetchNFTMetadata = async () => {
      console.log("Checking for Character NFT on address:", currentAccount);

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const gameContract = new ethers.Contract(
        CONTRACT_ADDRESS,
        myEpicGame.abi,
        signer
      );

      const txn = await gameContract.checkIfUserHasNFT();
      if (txn.name) {
        console.log("User has character NFT");
        setCharacterNFT(transformCharacterData(txn));
      }
      setIsLoading(false);
    };

    if (currentAccount) {
      console.log("CurrentAccount:", currentAccount);
      fetchNFTMetadata();
    }
  }, [currentAccount]);

  return (
    <div>    
      <header>
        <h1 className="gradient-text">Metaverse Defenders</h1>
        {renderSubtitle()}
      </header>

      <div className="container">
        {renderContent()}

        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`built with @${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </div>
  );
};

export default App;

