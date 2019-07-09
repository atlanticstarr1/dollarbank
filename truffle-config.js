const HDWalletProvider = require("truffle-hdwallet-provider");
const fs = require("fs");
const mnemonic = fs
  .readFileSync(".secret")
  .toString()
  .trim();

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
      version: "/Users/dnoel/.nvm/versions/node/v10.13.0/lib/node_modules/solc"
      // docker: true,        // Use "0.5.1" you've installed locally with docker (default: false)
      // settings: {          // See the solidity docs for advice about optimization and evmVersion
      //  optimizer: {
      //    enabled: false,
      //    runs: 200
      //  },
      //  evmVersion: "byzantium"
      // }
    }
  }
};