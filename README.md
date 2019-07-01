Dollar Bank

Welcome to dollar bank; a new concept in banking. This dapp is built using Ethereum smart contracts in Solidity, and React. Dollar bank pays interest on a daily basis to every customer who maintains a minimum of 1 USD balance. 

The USD/ETH exchange rates are fed to the contract using a Rhombus Lighthouse Oracle. The rate fed to the contract is 10 cents (USD) worth of ETH, which can then be used to determine which customers get interests, by converting balances to USD and vice-versa.

Requirements
git
truffle v5.0.25
solidity v0.5.0
node v10.13.0
npm 6.9.0
ganache core/ganache-cli

Setting up the development environment
There are a few technical requirements before we start. Please install the following:

Node.js v10+ LTS and npm (comes with Node)
Git

Once we have those installed, we only need one command to install Truffle:

npm install -g truffle

To verify that Truffle is installed properly, type truffle version on a terminal. If you see an error, make sure that your npm modules are added to your path.

We also will be using Ganache, a personal blockchain for Ethereum development you can use to deploy contracts, develop applications, and run tests. You can download Ganache by navigating to http://truffleframework.com/ganache and clicking the "Download" button.

Once the above is completed, follow Installation instructions to setup bank dapp.

Installation
1. 

