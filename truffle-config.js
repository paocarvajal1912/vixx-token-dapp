module.exports = {
  networks: {
    development: {
      host: '127.0.0.1',
      port: 8555,
      network_id: '*', // eslint-disable-line camelcase
    },
    ganache: {
      host: '127.0.0.1',
      port: 8454,
      network_id: '*', // eslint-disable-line camelcase
    }
  },
  solc: {
    optimizer: {
      enabled: true,
      runs: 200
    }
  }
};
