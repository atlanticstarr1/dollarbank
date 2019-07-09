pragma solidity ^0.5.10;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/DollarBank.sol";
import "../contracts/Lighthouse.sol";

contract TestDollarBank {
    // Give this test contract 10 ether to work with (sent from account[0] in ganache)
  uint public initialBalance = 10 ether;
  Lighthouse newlighthouse =  new Lighthouse();
  DollarBank bank =  new DollarBank(ILighthouse(address(newlighthouse)));
  uint depositAmt = 1 ether;


  event Receive(address sender, uint value);

  function beforeAll() public {
    newlighthouse.changeSearcher(bank);
    // give our bank some ethers to hold in reserve (interest will be originall paid out from this pot)
    address(bank).transfer(1 ether);
    // enroll this test contract
    bank.enroll();
  }

  function() external payable {
    emit Receive(msg.sender, msg.value);
  }

  /* -------------------------------- Lighthouse tests ---------------------------- */

  // Tests if I can write a value (6) into the lighthouse
    function testWrite() public {
      uint dataValue = 6;
      uint nonce = 1234;
      uint luckyNum = 0;
      bool ok = false;

      newlighthouse.write(dataValue, nonce);
      (luckyNum, ok) = newlighthouse.peekData();
      Assert.equal(luckyNum, dataValue, "write failed");
    }

  /* -------------------------------- Bank tests ---------------------------- */

  function testEnroll() public {
    bool isEnrolled = bank.enrolled(address(this));
    Assert.isTrue(isEnrolled,"not enrolled");
  }

  function testDeposit() public {
    bank.deposit.value(depositAmt)();
    uint balance = bank.getBalance();
    Assert.equal(balance, depositAmt, "no deposit was made");
  }

  function testWithdraw() public {
    uint withdrawAmt = 0.1 ether;
    uint expectedBalance = depositAmt - withdrawAmt;
    uint balance = bank.withdraw(withdrawAmt);
    Assert.equal(balance, expectedBalance, "balances after withdrawal incorrect.");
  }

  function testCloseAccount() public {
    bool closed = bank.closeAccount();
    uint balance = bank.getBalance();
    Assert.isTrue(closed, "account not closed");
    Assert.equal(balance, 0, "balance should be 0");
  }

  // writing to oracle should call 'poke' function on DollarBank contract
    function testpoke() public {
      uint dataValue = 390000000000000; // 10 cents(usd) in ether. this will change as ether price changes.
      uint nonce = 1234;
      uint tenCentsOfETH = 0;
      bool ok = false;
      newlighthouse.write(dataValue, nonce);

      // write to oracle
      (tenCentsOfETH, ok) = newlighthouse.peekData();
      Assert.equal(tenCentsOfETH, dataValue, "writing to oracle failed.");
    
      // Check 'poke' function was called.
      // If called, minEth = tenCentsOfETH * 10 * minUsd
      uint minEth = bank.minBalanceEth(); // should be updated if searcher was set.
      uint minUsd = bank.minBalanceUsd();
      uint expected = tenCentsOfETH * 10 * minUsd;
      Assert.equal(minEth, expected, "oracle didn't update contract. check poke() function.");
    }

     /* -------------------------------- Interest payment tests ---------------------------- */
     // Interest is paid if customer has a minumum of 1 USD balance in their account.
    function testpayInterest() public {
      // enroll in bank
      bank.enroll();

      // Make a deposit
      uint balance = bank.deposit.value(depositAmt)();
      Assert.equal(balance, depositAmt, "balance and deposit should be equal");

      // Trigger oracle to get ten cents (usd) in ether (will be done daily on mainnet).
      // This will also trigger interest payments.
      testpoke();

      // Pay interest
      //bank.payInterest();

      // re-read balance to get balance + interest (daily balance after interest added)
      uint newbalance = bank.getBalance();
      Assert.isTrue(newbalance > balance, "Interest was not paid");
      bank.closeAccount();
    }

    function testnoInterestPaid() public {
      // enroll in bank
      bank.enroll();

      // Make a deposit
      uint balance = bank.deposit.value(1000 wei)();
      Assert.equal(balance, 1000 wei, "balance and deposit should be equal");

      // Trigger oracle to get ten cents (usd) in ether (will be done daily on mainnet)
      testpoke();

       // Pay interest
      // bank.payInterest();

      // re-read balance to get balance + interest (daily balance after interest added)
      uint newbalance = bank.getBalance();
      Assert.isTrue(newbalance == balance, "Account has insufficient balance for interest.");
      bank.closeAccount();
    }
}