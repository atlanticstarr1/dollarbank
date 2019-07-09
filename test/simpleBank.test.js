/** Initialize contracts to be tested and helper function to catch errors */
let catchRevert = require("./exceptionsHelpers.js").catchRevert;
var DollarBank = artifacts.require("./DollarBank.sol");
var Lighthouse = artifacts.require("./Lighthouse.sol");

/** Contract to test DollarBank */
contract("DollarBank", function(accounts) {
  /// Setup test accounts and deposit to be used in each test
  const owner = accounts[0];
  const alice = accounts[1];
  const bob = accounts[2];
  const deposit = web3.utils.toBN(2);

  /// Before each test, redeploy contracts to start fresh.
  beforeEach(async () => {
    lighthouse = await Lighthouse.new();
    mybank = await DollarBank.new(lighthouse.address);
  });

  it("should mark addresses as enrolled", async () => {
    await mybank.enroll({ from: alice });
    const aliceEnrolled = await mybank.enrolled(alice, { from: alice });
    assert.equal(
      aliceEnrolled,
      true,
      "enroll balance is incorrect, check balance method or constructor"
    );
  });

  it("should not mark unenrolled users as enrolled", async () => {
    const ownerEnrolled = await mybank.enrolled(owner, { from: owner });
    assert.equal(
      ownerEnrolled,
      false,
      "only enrolled users should be marked enrolled"
    );
  });

  it("should not enroll if paused", async () => {
    await mybank.pauseContract();
    await catchRevert(mybank.enroll({ from: alice }));
  });

  it("should deposit correct amount", async () => {
    await mybank.enroll({ from: alice });
    await mybank.deposit({ from: alice, value: deposit });
    const balance = await mybank.getBalance({ from: alice });

    assert.equal(
      deposit.toString(),
      balance,
      "deposit amount incorrect, check deposit method"
    );
  });

  it("should not deposit if unenrolled", async () => {
    await catchRevert(mybank.deposit({ from: alice, value: deposit }));
  });

  it("should not deposit if paused", async () => {
    await mybank.pauseContract();
    await catchRevert(mybank.deposit({ from: alice, value: deposit }));
  });

  it("should log a deposit event when a deposit is made", async () => {
    await mybank.enroll({ from: alice });
    const result = await mybank.deposit({ from: alice, value: deposit });

    const expectedEventResult = { accountAddress: alice, amount: deposit };

    const logAccountAddress = result.logs[0].args.accountAddress;
    const logDepositAmount = result.logs[0].args.amount.toNumber();

    assert.equal(
      expectedEventResult.accountAddress,
      logAccountAddress,
      "LogDepositMade event accountAddress property not emitted, check deposit method"
    );
    assert.equal(
      expectedEventResult.amount,
      logDepositAmount,
      "LogDepositMade event amount property not emitted, check deposit method"
    );
  });

  it("should withdraw correct amount", async () => {
    const initialAmount = 0;
    await mybank.enroll({ from: alice });
    await mybank.deposit({ from: alice, value: deposit });
    await mybank.withdraw(deposit, { from: alice });
    const balance = await mybank.getBalance({ from: alice });

    assert.equal(
      balance.toString(),
      initialAmount.toString(),
      "balance incorrect after withdrawal, check withdraw method"
    );
  });

  it("should withdraw if paused", async () => {
    const initialAmount = 0;
    await mybank.enroll({ from: alice });
    await mybank.deposit({ from: alice, value: deposit });
    await mybank.pauseContract();
    await mybank.withdraw(deposit, { from: alice });
    const balance = await mybank.getBalance({ from: alice });

    assert.equal(
      balance.toString(),
      initialAmount.toString(),
      "balance incorrect after withdrawal, check withdraw method"
    );
  });

  it("should not withdraw if unenrolled", async () => {
    await catchRevert(mybank.withdraw(deposit, { from: alice }));
  });

  it("should not be able to withdraw more than has been deposited", async () => {
    await mybank.enroll({ from: alice });
    await mybank.deposit({ from: alice, value: deposit });
    await catchRevert(mybank.withdraw(deposit + 1, { from: alice }));
  });

  it("should emit the appropriate event when a withdrawal is made", async () => {
    const initialAmount = 0;
    await mybank.enroll({ from: alice });
    await mybank.deposit({ from: alice, value: deposit });
    var result = await mybank.withdraw(deposit, { from: alice });

    const accountAddress = result.logs[0].args.accountAddress;
    const newBalance = result.logs[0].args.newBalance.toNumber();
    const withdrawAmount = result.logs[0].args.withdrawAmount.toNumber();

    const expectedEventResult = {
      accountAddress: alice,
      newBalance: initialAmount,
      withdrawAmount: deposit
    };

    assert.equal(
      expectedEventResult.accountAddress,
      accountAddress,
      "LogWithdrawal event accountAddress property not emitted, check deposit method"
    );
    assert.equal(
      expectedEventResult.newBalance,
      newBalance,
      "LogWithdrawal event newBalance property not emitted, check deposit method"
    );
    assert.equal(
      expectedEventResult.withdrawAmount,
      withdrawAmount,
      "LogWithdrawal event withdrawalAmount property not emitted, check deposit method"
    );
  });

  it("should close account and refund account balance", async () => {
    const initialAmount = 0;
    await mybank.enroll({ from: alice });
    await mybank.deposit({ from: alice, value: deposit });
    await mybank.closeAccount({ from: alice });
    const balance = await mybank.getBalance({ from: alice });

    assert.equal(
      balance.toString(),
      initialAmount.toString(),
      "balance incorrect after account closure, check closeAccount method"
    );
  });

  it("cannot close an account not enrolled", async () => {
    await catchRevert(mybank.closeAccount({ from: alice }));
  });

  it("cannot close an account if contract is paused", async () => {
    await mybank.enroll({ from: alice });
    await mybank.pauseContract({ from: owner });
    await catchRevert(mybank.closeAccount());
  });

  it("should close account and unenroll customer", async () => {
    await mybank.enroll({ from: alice });
    await mybank.deposit({ from: alice, value: deposit });
    await mybank.closeAccount({ from: alice });
    const aliceEnrolled = await mybank.enrolled(alice, { from: alice });

    assert.equal(
      aliceEnrolled,
      false,
      "account still enrolled. check closeAccount method"
    );
  });

  it("should emit appropriate event when account is closed", async () => {
    await mybank.enroll({ from: alice });
    await mybank.deposit({ from: alice, value: deposit });
    var result = await mybank.closeAccount({ from: alice });

    const expectedEventResult = {
      accountAddress: alice,
      balanceAtClose: deposit
    };

    const logAccountAddress = result.logs[0].args.accountAddress;
    const logBalanceAtClose = result.logs[0].args.balanceAtClose.toNumber();

    assert.equal(
      expectedEventResult.accountAddress,
      logAccountAddress,
      "ClosedAccount event accountAddress property not emitted, check ClosedAccount method"
    );
    assert.equal(
      expectedEventResult.balanceAtClose,
      logBalanceAtClose,
      "ClosedAccount event balanceAtClose property not emitted, check ClosedAccount method"
    );
  });

  it("should set the interest rate", async () => {
    // by owner
    await mybank.setInterestRate(2, { from: owner });
    const rate = await mybank.interestRate();
    assert.equal(2, rate, "Interest rate is incorrect");
    // out of range
    await catchRevert(mybank.setInterestRate(10, { from: owner }));
    // not owner
    await catchRevert(mybank.setInterestRate(5, { from: alice }));
  });

  it("should set the mininum balance", async () => {
    // by owner
    await mybank.setMinBalance(2, { from: owner });
    const minbalance = await mybank.minBalanceUsd();
    assert.equal(minbalance, 2, "min balance should match");
    // not owner
    await catchRevert(mybank.setMinBalance(10, { from: alice }));
  });

  // Write to lighthouse
  it("write a value into lighthouse", async () => {
    let dataValue = 6;
    let nonce = 1234;
    let luckyNum = 0;

    await lighthouse.write(dataValue, nonce);
    const result = await lighthouse.peekData();
    luckyNum = result[0];
    assert.equal(dataValue, luckyNum, "write to lighthouse failed");
  });

  // can pay interest to customers; deposit > 1 usd
  it("should pay interest when deposit greater than 1 USD", async () => {
    let dataValue = 370000000000000; // 10 cents (usd) in wei as of 6/16/2019
    let nonce = 1234;
    let deposit = web3.utils.toWei("1", "ether");

    //alice deposit 1 ether
    await mybank.enroll({ from: alice });
    await mybank.deposit({ from: alice, value: deposit });

    // tell oracle which contract to call when oracle's data is updated
    await lighthouse.changeSearcher(mybank.address, { from: owner });
    // update oracle with price (will be done daily)
    await lighthouse.write(dataValue, nonce);
    await mybank.payInterestOwner({ from: owner });

    // check new balance
    const newbalance = await mybank.getBalance({ from: alice });
    assert.isTrue(newbalance.toString() > deposit, "no interest paid");
  });

  // can pay interest to customers; deposit > 1 usd
  it("should pay interest when lighthouse updates", async () => {
    let dataValue = 370000000000000; // 10 cents (usd) in wei as of 6/16/2019
    let nonce = 1234;
    let deposit = web3.utils.toWei("1", "ether");

    //alice deposit 1 ether
    await mybank.enroll({ from: alice });
    await mybank.deposit({ from: alice, value: deposit });

    // tell oracle which contract to call when oracle's data is updated
    await lighthouse.changeSearcher(mybank.address, { from: owner });
    // update oracle with price (will be done daily)
    await lighthouse.write(dataValue, nonce);

    // check new balance
    const newbalance = await mybank.getBalance({ from: alice });
    assert.isTrue(newbalance.toString() > deposit, "no interest paid");
  });

  it("should not pay interest when deposit less than 1 USD", async () => {
    let dataValue = 370000000000000; // 10 cents (usd) in wei as of 6/16/2019
    let nonce = 1234;
    let deposit = web3.utils.toWei("1000", "wei");

    //alice deposit 1000 wei (less than 1 USD)
    await mybank.enroll({ from: alice });
    await mybank.deposit({ from: alice, value: deposit });

    // tell oracle which contract to call when oracle's data is updated
    await lighthouse.changeSearcher(mybank.address, { from: owner });
    // update oracle with price (will be done daily)
    await lighthouse.write(dataValue, nonce);
    await mybank.payInterestOwner({ from: owner });

    // check new balance
    const newbalance = await mybank.getBalance({ from: alice });
    assert.equal(newbalance.toString(), deposit, "interest paid");
  });

  it("should not pay interest when interest payments is stopped", async () => {
    let dataValue = 370000000000000;
    let nonce = 1234;
    let deposit = web3.utils.toWei("1", "ether");

    //alice deposit 1 ether
    await mybank.enroll({ from: alice });
    await mybank.deposit({ from: alice, value: deposit });

    // stop interest payments
    await mybank.stopPayments({ from: owner });

    // tell oracle which contract to call when oracle's data is updated
    await lighthouse.changeSearcher(mybank.address, { from: owner });
    // update oracle with price (will be done daily)
    await catchRevert(lighthouse.write(dataValue, nonce));
  });

  it("should not pay interest if not triggered by owner", async () => {
    let dataValue = 370000000000000;
    let nonce = 1234;
    let deposit = web3.utils.toWei("1", "ether");

    //alice deposit 1 ether
    await mybank.enroll({ from: alice });
    await mybank.deposit({ from: alice, value: deposit });

    // tell oracle which contract to call when oracle's data is updated
    await lighthouse.changeSearcher(mybank.address, { from: owner });
    // update oracle with price (will be done daily)
    await lighthouse.write(dataValue, nonce);
    await catchRevert(mybank.payInterestOwner({ from: alice }));
  });
});
