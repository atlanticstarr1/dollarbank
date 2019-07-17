/** Initialize contracts to be tested and helper function to catch errors */
let catchRevert = require("./exceptionsHelpers.js").catchRevert;
var DollarBank = artifacts.require("./DollarBank.sol");
var Lighthouse = artifacts.require("./Lighthouse.sol");

/** Contract to test DollarBank */
contract("DollarBank", function(accounts) {
  /// Setup test accounts and deposit to be used in each test
  const owner = accounts[0];
  const alice = accounts[1];
  const deposit = web3.utils.toBN(2);

  /// Before each test, redeploy contracts to start fresh.
  beforeEach(async () => {
    lighthouse = await Lighthouse.new();
    mybank = await DollarBank.new(lighthouse.address);
  });

  /// Enroll a user
  it("should mark addresses as enrolled", async () => {
    await mybank.enroll({ from: alice });
    const aliceEnrolled = await mybank.enrolled(alice, { from: alice });
    assert.equal(
      aliceEnrolled,
      true,
      "enroll balance is incorrect, check balance method or constructor"
    );
  });

  /// Users who haven't enrolled shouldn't be marked as enrolled
  it("should not mark unenrolled users as enrolled", async () => {
    const ownerEnrolled = await mybank.enrolled(owner, { from: owner });
    assert.equal(
      ownerEnrolled,
      false,
      "only enrolled users should be marked enrolled"
    );
  });

  /// Cannot enroll if contract is paused.
  it("should not enroll if paused", async () => {
    await mybank.pauseContract();
    await catchRevert(mybank.enroll({ from: alice }));
  });

  /// Accept and record a deposit
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

  /// You must enroll before depositing
  it("should not deposit if unenrolled", async () => {
    await catchRevert(mybank.deposit({ from: alice, value: deposit }));
  });

  /// Cannot deposit if contract is paused
  it("should not deposit if paused", async () => {
    await mybank.pauseContract();
    await catchRevert(mybank.deposit({ from: alice, value: deposit }));
  });

  /// Emit deposit event when deposit is made
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

  /// Withdraw an amount less than or equal to balance without errors.
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

  /// Withdraw even if contract is paused
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

  /// Must first have enrolled before withdrawing
  it("should not withdraw if unenrolled", async () => {
    await catchRevert(mybank.withdraw(deposit, { from: alice }));
  });

  /// Cannot withdraw more than balance
  it("should not be able to withdraw more than has been deposited", async () => {
    await mybank.enroll({ from: alice });
    await mybank.deposit({ from: alice, value: deposit });
    await catchRevert(mybank.withdraw(deposit + 1, { from: alice }));
  });

  /// Emit withdrawal event when withdrawal is made
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

  /// When account is closed, user balance is returned to wallet
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

  /// Must be enrolled before allowed to close account
  it("cannot close an account not enrolled", async () => {
    await catchRevert(mybank.closeAccount({ from: alice }));
  });

  /// Cannot close accout if contract is paused.
  it("cannot close an account if contract is paused", async () => {
    await mybank.enroll({ from: alice });
    await mybank.pauseContract({ from: owner });
    await catchRevert(mybank.closeAccount());
  });

  /// When account is closed, user should be automatically unenrolled
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

  /// Emit correct event when account is closed.
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

  /// Set interest rate (1% - 6%)
  it("should set the interest rate", async () => {
    /// by owner
    await mybank.setInterestRate(2, { from: owner });
    const rate = await mybank.interestRate();
    assert.equal(2, rate, "Interest rate is incorrect");
    /// out of range
    await catchRevert(mybank.setInterestRate(10, { from: owner }));
    /// not owner
    await catchRevert(mybank.setInterestRate(5, { from: alice }));
  });

  /// Set minimum balance to be eligible for interest (in USD)
  it("should set the mininum balance", async () => {
    /// by owner
    await mybank.setMinBalance(2, { from: owner });
    const minbalance = await mybank.minBalanceUsd();
    assert.equal(minbalance, 2, "min balance should match");
    /// not owner
    await catchRevert(mybank.setMinBalance(10, { from: alice }));
  });

  /// Write data into Lighthouse.
  it("write a value into lighthouse", async () => {
    let dataValue = 6;
    let nonce = 1234;
    let luckyNum = 0;

    await lighthouse.write(dataValue, nonce);
    const result = await lighthouse.peekData();
    luckyNum = result[0];
    assert.equal(dataValue, luckyNum, "write to lighthouse failed");
  });

  /// Owner can trigger interest payment for balances greater than or equal to the
  /// minimum balance
  it("owner can pay interest", async () => {
    let deposit = web3.utils.toWei("1", "ether");
    await mybank.enroll({ from: alice });
    await mybank.deposit({ from: alice, value: deposit });
    await mybank.payInterestOwner({ from: owner });

    /// check new balance
    const newbalance = await mybank.getBalance({ from: alice });
    assert.isTrue(newbalance.toString() > deposit, "no interest paid");
  });

  /// Interest is paid when Lighthouse writes new ETH price to contract.
  /// Customers must have a balance greater than or equal to the minimum balance.
  it("should pay interest when lighthouse updates", async () => {
    let dataValue = 370000000000000; // 10 cents (usd) in wei as of 6/16/2019
    let nonce = 1234;
    let deposit = web3.utils.toWei("1", "ether");

    await mybank.enroll({ from: alice });
    await mybank.deposit({ from: alice, value: deposit });

    /// tell oracle which contract to call when oracle's data is updated
    await lighthouse.changeSearcher(mybank.address, { from: owner });
    /// update oracle with price (will be done daily)
    await lighthouse.write(dataValue, nonce);

    /// check new balance
    const newbalance = await mybank.getBalance({ from: alice });
    assert.isTrue(newbalance.toString() > deposit, "no interest paid");
  });

  /// Do not pay interest to customers having less than the minimum balance.
  it("should not pay interest when deposit less than 1 USD", async () => {
    let dataValue = 370000000000000; // 10 cents (usd) in wei as of 6/16/2019
    let nonce = 1234;
    let deposit = web3.utils.toWei("1000", "wei");

    /// alice deposit 1000 wei (less than 1 USD)
    await mybank.enroll({ from: alice });
    await mybank.deposit({ from: alice, value: deposit });

    /// tell oracle which contract to call when oracle's data is updated
    await lighthouse.changeSearcher(mybank.address, { from: owner });
    /// update oracle with price (will be done daily)
    await lighthouse.write(dataValue, nonce);
    //await mybank.payInterestOwner({ from: owner });

    /// check new balance
    const newbalance = await mybank.getBalance({ from: alice });
    assert.equal(newbalance.toString(), deposit, "interest paid");
  });

  /// Do not pay interest if interest payments is stopped or contract is paused.
  it("should not pay interest when interest payments is stopped", async () => {
    let dataValue = 370000000000000;
    let nonce = 1234;
    let deposit = web3.utils.toWei("1", "ether");

    /// alice deposit 1 ether
    await mybank.enroll({ from: alice });
    await mybank.deposit({ from: alice, value: deposit });

    /// stop interest payments
    await mybank.stopPayments({ from: owner });

    /// tell oracle which contract to call when oracle's data is updated
    await lighthouse.changeSearcher(mybank.address, { from: owner });
    /// update oracle with price (will be done daily)
    await catchRevert(lighthouse.write(dataValue, nonce));
  });

  /// Ten cents (USD) of ETH should not be more than 1 ETH
  it("should not set ten cents of ETH to more than 1 ETH", async () => {
    let dataValue = web3.utils.toWei("2", "ether");
    let nonce = 1234;

    await lighthouse.changeSearcher(mybank.address, { from: owner });
    await catchRevert(lighthouse.write(dataValue, nonce));
  });

  /// Other than Lighthouse, only Owner can trigger interest payments.
  it("should not pay interest if not triggered by owner", async () => {
    let dataValue = 370000000000000;
    let nonce = 1234;
    let deposit = web3.utils.toWei("1", "ether");

    /// alice deposit 1 ether
    await mybank.enroll({ from: alice });
    await mybank.deposit({ from: alice, value: deposit });

    /// tell oracle which contract to call when oracle's data is updated
    await lighthouse.changeSearcher(mybank.address, { from: owner });
    /// update oracle with price (will be done daily)
    await lighthouse.write(dataValue, nonce);
    await catchRevert(mybank.payInterestOwner({ from: alice }));
  });

    /// Store and retrieve user's profile pic ipfs hash
    it("should store and retrieve ipfs hash", async () => {
      const ipfsHashOfProfPic = 'QmYjh5NsDc6LwU3394NbB42WpQbGVsueVSBmod5WACvpte';
      await mybank.setProfilePic(ipfsHashOfProfPic,{from:alice});
      let ipfsHash = await mybank.getProfilePic({ from: alice});
      assert.equal(ipfsHash,ipfsHashOfProfPic);
  
    });
});
