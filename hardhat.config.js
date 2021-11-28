require("dotenv").config();
require("@nomiclabs/hardhat-ethers");
require("@openzeppelin/hardhat-upgrades");

const alchemyApiKey = process.env.ALCHEMY_URL_KEY;
const mnemonic = process.env.MNEMONIC;

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.7.3",
  networks: {
    kovan: {
      url: alchemyApiKey,
      accounts: {mnemonic: mnemonic}
    }
  }
};

