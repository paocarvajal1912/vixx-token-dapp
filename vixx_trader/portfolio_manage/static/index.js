const wallet_element = React.createElement;
// const default_interface = wallet_element(
//   'button',
//   {
//     onClick: () => { App() },
//     className: "metamask-button"
//   },
//   'Connect Wallet'
// );

class WalletConnectButton extends React.Component {
  constructor(props) {
    super(props);
    this.props.ch
    this.state = {
      syncedWallet: false,
      account: undefined,
      interface: undefined
    };
  }
  
  componentDidMount() {
    new Promise(App).then((_account) => {
      this.setState({
        account: _account,
        interface: <div><p>{`Hi there ${_account}!!!`}</p></div>
      })
    }).catch((_) => { alert("No worries :)") });
  }
  
  render() {
    return (
      <div>
        {this.state.interface}
      </div>
    )
  };
}

const App = () => {
  const loginMetaMask = async () => {
    const { ethereum } = window;
    const accounts = await ethereum.request({ method: "eth_requestAccounts" })

    if (accounts.length !== 0) {
      console.log("Found an authorized account:", accounts[0]);
      return accounts[0];
    } else {
      console.log("No authorized account found");
      return "hi";
    }
  };

  return loginMetaMask();
};

// const Account = (button) => {
//   const getConnectedAccounts = async () => {  
//     const accounts = await ethereum.request({ method: 'eth_accounts' });

//     if (accounts.length !== 0) {
//       button.account = accounts[0];
//       button.syncedWallet = true;
//       console.log("Found an authorized account.");
//     } else {
//       console.log("No authorized account found.")
//     }
//   }

//   getConnectedAccounts();

//   return button;
// }


const domContainer = document.querySelector('#like_button_container');
ReactDOM.render(wallet_element(WalletConnectButton), domContainer);

