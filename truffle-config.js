const HDWalletProvider = require("truffle-hdwallet-provider");
const fs = require("fs");

module.exports = {
  contracts_build_directory: "./app/src/contracts",
  networks: {
    development: {
      host: "localhost",
      port: 8545,
      network_id: "*" // Match any network id
    },

    rinkeby: {
      provider: function() {
        const mnemonic = fs
          .readFileSync(__dirname + "/.secret")
          .toString()
          .trim();
        return new HDWalletProvider(
          mnemonic,
          "https://rinkeby.infura.io/v3/58d2a40f4d1f4cfb990f68d50ce7b419"
        );
      },
      network_id: 4
    }
  },
  compilers: {
    solc: {
      version: "0.5.10"
    }
  }
};
