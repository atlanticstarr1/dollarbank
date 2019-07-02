# Dollar Bank

Welcome to dollar bank; a new concept in banking. This dapp is built using Ethereum smart contracts in Solidity, and React. Dollar bank pays interest on a daily basis to every customer who maintains a minimum of 1 USD balance. 

The USD/ETH exchange rates are fed to the contract using a Rhombus Lighthouse Oracle. The rate fed to the contract is 10 cents (USD) worth of ETH, which can then be used to determine which customers get interests, by converting balances to USD and vice-versa.

## Features
  * Enroll accounts
  * Make deposits (Min 1 USD to get interest)
  * Make Withdrawals
  * Close account (Entire balance will be sent to back to wallet)
  * Wait 2 mins to see interest paid to account. (In production, interest will be paid every 24 hrs).
  
  ***ADMIN (Account 1)***
  * Change min balance
  * Change interest rate
  * Start/stop interest payments
  * Pause/unpause contract (Only withdrawal and account closure will workd)
  * Trigger interest payments
  * Write to Oracle (Powerful feature !!). In production this could be a trusted 3rd party like Rhombus.

## Setting up the development environment
There are a few technical requirements before we start. Please install the following:

* `Node.js v10+ LTS and npm (comes with Node)`
* `Git`

Once we have those installed, install Truffle:

`npm install -g truffle`

To verify that Truffle is installed properly, type `truffle version` on a terminal.
If you see an error, make sure that your npm modules are added to your path.

We also will be using Ganache, a personal blockchain for Ethereum development you can use to deploy contracts, develop applications, and run tests. 

Install ganache-cli

`npm install -g ganache-cli`

## Launching our personal blockchain with Ganache
Before we move ahead, let's first launch our test blockchain with Ganache.

open up a new terminal, and run the following command: 

`ganache-cli`

This will spawn a new blockchain that listens on `127.0.0.1:8545` by default.

Once ganache is running, follow the below to setup the dapp.

## Installation
> Clone the project
1. `git clone https://github.com/atlanticstarr1/dollarbank.git`
2. `cd dollarbank`
> Compile the contracts
3. `truffle compile`
>> Migrate to ganache blockchain
4. `truffle migrate --reset`
>> Test the smart contracts
5. `truffle test`
>> Install React app to interact with smart contract
6. `cd app`
7. `npm install`
8. `npm start`

## Interacting with the dapp in a browser
Now we're ready to use our dapp!

### Installing and configuring MetaMask
The easiest way to interact with our dapp in a browser is through MetaMask, a browser extension for both Chrome and Firefox.

1. Install MetaMask in your browser.
2. Once installed, a tab in your browser should open, with a **Get Started** button
3. After clicking Get Started, you should see the initial MetaMask screen. Click **Import Wallet**.
4. Next, you should see a screen requesting anonymous analytics. Choose to decline or agree.
5. In the box marked **Wallet Seed**, enter the mnemonic (12 word seed) that is displayed in Ganache.
5. Enter a password below that and click OK.
6. If all goes well, MetaMask should display a Congratulations screen. Click All Done.
7. Now we need to connect MetaMask to the blockchain created by Ganache. Click the menu that shows **Main Network** and select **Custom RPC**
8. In the box titled **New Network** enter `http://127.0.0.1:8545` and click **Save**
The network name at the top will switch to say `http://127.0.0.1:8545`
9. Click the top-right X to close out of Settings and return to the Accounts page.

Each account created by Ganache is given 100 ether. You'll notice it's slightly less on the first account because some gas was used when the contract itself was deployed and when the tests were run.

Configuration is now complete.

### Using the dapp
1. Navigate to `localhost:3000`
The dapp welcome screen is shown.
2. Click on 'Connect using metamask' button.
3. A MetaMask pop-up should appear requesting your approval to allow Dollar Bank App to connect to your MetaMask wallet. Without explicit approval, you will be unable to interact with the dapp. Click **Connect**.
4. To use the dapp, click the Enroll button at the bottom to enroll your current Metamask account.
5. You'll be automatically prompted to approve the transaction by MetaMask. Click Submit to approve the transaction.
6. You'll see a new card created titled 'Bank' with a current balace of 0 ETH.
Note: If you do not see the 'Bank' card, refreshing the app in the browser should trigger it.
And in MetaMask, you'll see the transaction listed.
You'll also see the same transaction listed in Ganache under the "Transactions" section.
Congratulations! You ar now on your way to a wealthier future :bowtie:

7. Enter an amount of ETH to deposit, and click 'Deposit'
