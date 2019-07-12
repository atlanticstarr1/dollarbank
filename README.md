# DollarBank

## Acknowledgement ##
The Lighthouse contract in use was developed by Rhombus and can be viewed here https://github.com/RhombusNetwork/rhombus-public/tree/master/lighthouse

Also, the idea for a bank was inspired by a simple bank exercise i completed by Consensys academy blockchain bootcamp.

## Description ##
Welcome to dollar bank; a new concept in banking. This dapp is built using Ethereum smart contracts in Solidity, and React. Dollar bank pays interest on a daily basis to every customer who maintains a minimum of 1 USD balance. 

The USD/ETH exchange rates are fed to the contract using a Rhombus Lighthouse Oracle. The rate fed to the contract is 10 cents (USD) worth of ETH, which can then be used to determine which customers get interests, by converting balances to USD and vice-versa. 

For this project, we will write data to the Lighthouse ourselves but in production, an actual Oracle will supply the data.

## Interest ##
Interest payments are triggered everytime the Oracle updates the price in ETH for ten cents (USD), which will happen once per day in production. Payments can also be triggered by the contract administrator, should it become necessary. Daily interest is calculated using the formula:
  - `Daily interest = Interest rate (%) / 365 * Balance`

## Features
  **General**
  * Enroll accounts
  * Make deposits (Min 1 USD to get interest)
  * Make Withdrawals
  * Close account (Entire balance will be sent to back to wallet)
  * Get interest daily by maintaining the min balance
  
  **Admin/Contract creator (Account 1)**
  * Change min balance
  * Change interest rate
  * Start/stop interest payments
  * Pause/unpause contract (only withdrawal will work)
  * Trigger interest payments
  * Write to Oracle (Powerful feature !!). In production this could be a trusted 3rd party like Rhombus.

## Setting up the development environment
There are a few technical requirements before we start. Please install the following:

* `node.js v10+ LTS and npm (comes with Node)`
* `git`

Once we have those installed, install Truffle:

`npm install -g truffle`

To verify that Truffle is installed properly, type `truffle version` on a terminal.

We also will be using Ganache, a personal blockchain for Ethereum development you can use to deploy contracts, develop applications, and run tests. 

We use ganache-cli for this dapp but for those interested in the GUI version, you can download Ganache by navigating to http://truffleframework.com/ganache and clicking the "Download" button.

Now install ganache-cli

`npm install -g ganache-cli`

## Launching our personal blockchain with Ganache
Before we move ahead, let's first launch our test blockchain with Ganache.

open up a new terminal, and run the following command: 

`ganache-cli -i 5777`

This will spawn a new blockchain that listens on `127.0.0.1:8545` by default, with a network id of `5777` (*needed by this dapp*)

**Ensure ganache is running before proceeding.**

## Installation
> Clone the project
1. `git clone https://github.com/atlanticstarr1/dollarbank.git`
2. `cd dollarbank && npm install`
> Compile the contracts
3. `truffle compile`
> Migrate to ganache blockchain
4. `truffle migrate --reset`
> Run tests. All tests should pass.
5. `truffle test`
> Install React app to interact with smart contract
6. `cd app && npm install`
7. `npm start`

## Interacting with the dapp in a browser

### Installing and configuring MetaMask
The easiest way to interact with our dapp in a browser is through MetaMask, a browser extension for both Chrome and Firefox.

1. Install MetaMask in your browser (https://metamask.io/)
2. Once installed, a tab in your browser should open, with a **Get Started** button
3. After clicking Get Started, you should see the initial MetaMask screen. Click **Import Wallet**.
4. Next, you should see a screen requesting anonymous analytics. Choose to ***decline*** or ***agree***.
5. In the box marked **Wallet Seed**, enter the mnemonic (12 word seed) that is displayed in Ganache.
5. Enter a password below that and click **OK**.
6. If all goes well, MetaMask should display a **Congratulations screen**. Click All Done.
7. Now we need to connect MetaMask to the blockchain created by Ganache. Click the menu that shows **Main Ethereum Network** and select ***Localhost 8545***

Each account created by Ganache is given 100 ether. You'll notice it's slightly less on the first & second account because some gas was used when the contract itself was deployed and when the tests were run.

> Configuration is now complete.

### Using the dapp
1. Navigate to `localhost:3000`
The dapp welcome screen is shown.
2. Click on **Connect with Metamask** button.
3. A MetaMask pop-up should appear requesting your approval to allow Dollar Bank App to connect to your MetaMask wallet. Without explicit approval, you will be unable to interact with the dapp. Click **Connect**.

Now we're ready to use the dapp!!

> Note the graceful alerts at the bottom right of the dapp as you
> interact with it

**FUND THE BANK**
Give the bank some seed ETH; starting capital to payout interests.
1. In Metamask, select Account 1 (admin account)
2. Click the **Send** button
3. Enter bank contract address in **TO** field. 

> Get bank address from welcome screen on dapp or from ganache when you migrated.

4. Enter 1 ETH (or any amount) in the **Amount** field.
5. Click Next, and Confirm.

**ENROLL AN ACCOUNT**
1. Click the Enroll button at the bottom to enroll your current Metamask account.
2. You'll be prompted to approve the transaction by MetaMask. Click **Confirm** to approve the transaction.
3. You'll see a new card created titled **Bank Account** with a current balace of 0 ETH.

> *Note: If you do not see the **Bank Account** card, refresh the app in the browser.*

And in MetaMask, you'll see the transaction listed.

You'll also see the same transaction listed in Ganache under the "Transactions" section.

> Congratulations! You ar now on your way to a wealthier future :bowtie:

**MAKE A DEPOSIT**
1. Enter a deposit amount in ETH.
2. Click the **Deposit** button
3. **Confirm** the transaction in Metamask.
4. Notice your wallet(***debited***) and bank account(***credited***) balance update accordingly. 
*(May have slight delay based on confirmation speed)*

**MAKE A WITHDRAWAL**
1. Enter a withdrawal amount in ETH. 
*(:point_right: play with different amounts to see validations at work)*
2. Click the **Withdraw** button
3. ***Confirm*** the transaction in Metamask.
4. Notice your wallet(***credited***) and bank account(***debited***) balance update accordingly.

**INTEREST PAYMENTS**

If your balance is greater than or equal to the mininum balance (default is 1 USD) you will see interest being added to your account every time the Oracle writes to the Lighthouse!!!.

> In production, this will be happen every 24 hrs, but for demo
> purposes, we will write to the Lighthouse ourselves.

##### HOW TO WRITE TO THE LIGHTHOUSE
There are 2 ways to write to the Lighthouse.

**EASY WAY**
1. Switch to Account 1 (Admin acct)
2. Click the Oracle Admin button at the top of the dapp.
3. Enter the price of 10 cents (USD) worth of ETH in wei.
4. Click 'Update price' button.
5. Confirm in Metamask ... and Voila !!
6. ... Watch your bank balance grow. 

> Note: you will only see your balance increase if you have at least the min balance deposited.

**HARD WAY**
1. In Chrome/Firefox .. open remix ide (https://remix.ethereum.org)
2. Create a new file called **Lighthouse.sol**
3. Copy the Lighthouse.sol contract code from repo above `~/contracts/Lighthouse.sol` and paste into file created in **step 2.**
4. Click `Compile` tab and select solidity version **0.5.10+commit.5a6ea5b1**.
5. Check `Auto compile` .. you should see 2 contracts highlighted below in green; ***(Lighthouse and Searcher).***
6. Switch to `Run` tab ... i told you this was long :sweat:
7. Select `Injected Web3` for Environment (we are still using Metamask).
8. Account should already be set to **Account 1** from Metamask *(admin/creator account).*
9. Leave the other options 'as is'
10. Ensure **Lighthouse** contract is displayed in the contracts dropdown.
11. Now, copy the **Lighthouse** contract address from when you tuffle migrated the contracts earlier.
12. Paste this address in the `Load contract from address` field.
13. Select the **At Address** button
14. You should now see the options to interact with the Lighthouse contract.
15. In the **write** field, enter the price of 10 cents (USD) worth of ETH in wei, **AND** any random number for the nonce.
16. Click the **write** button and confirm in Metamask.
17. ... watch your bank balance change :relieved:

You can also manually trigger interest payments as the Admin. 
>1. Switch to Account 1 in Metamask
>2. Click on the **Bank Admin** button at top of the dapp.
>3. Click **Pay interest** and **Confirm** in Metamask.

This functionality may become necessary if interest payments were missed for any reason.

> Notice the value *(in USD)* of your balances change depending on the value of ETH fed into the contract by the Lighthouse.

**_IMP!!!_** After getting your interests payments, if you try withdrawing your full balance, and you get an error stating that the *"Bank cannot pay interest at the moment"* ... it's because the bank needs to keep ETH on hand to pay its customers so in reality such a bank needs to have a process in place to generate revenue. 

***This is why you funded the bank with some ETH earlier.***

**CLOSE YOUR ACCOUNT**
1. Click the **Close account** button.
3. Confirm the transaction in Metamask.
4. Notice your wallet will be credited will the full bank account balance.

### ADMIN/CONTRACT CREATOR ###
**Account 1** is the contract deployer address. As the admin, you will notice 2 buttons at the top of the Welcom card; **Bank Admin** and **Oracle Admin**.

**Bank Admin** shows a dashboard that allows you to have FULL control of the bank contract. From here you can:
* Pause the contract (circuit breaker pattern)
* Start/stop interest payments
* Change the interest rate (1% - 6%) and min balance;min balance is the mininum balance you must have in your bank account to start gaining interest.
 * You can also see all the accounts currently registered
 * ... and maybe the most powerful feature, YOU can initiate interest payments by pressing the **Pay interest** button; *try it*
 
 **Oracle Admin** shows a dashboard that allows you to interact with the Lighthouse. From here you can:
 * Set the value of 10 cents (USD) worth of ETH. (default is 330000000000000 wei). 
    - This will first set the value of ten cents worth of ETH in the contract, then  
    - Trigger interest payemnts !!
    - :point_right:*Try it !!* .. and notice your bank balance change in real time :grin:
 * Set the address of the contract to alert when the oracle updates. (default is DollarBank contract address)
