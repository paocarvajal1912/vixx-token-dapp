require("dotenv").config();
require("@nomiclabs/hardhat-waffle");


module.exports = {
  solidity: '0.5.5',
  networks: {
    kovan: {
      url: process.env.ALCHEMY_URL_KEY,
      accounts: [process.env.PRIMARY_PRIVATE_KEY],
    },
  },
};
