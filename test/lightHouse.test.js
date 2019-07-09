/** Initialize contracts to be tested and helper function to catch errors */
var DollarBank = artifacts.require("./DollarBank.sol");
var Lighthouse = artifacts.require("./Lighthouse.sol");

/** Contract to test Lighthouse */
contract("Lighthouse", async () => {
  /// Before all test, redeploy contracts to start fresh.
  before(async () => {
    lighthouse = await Lighthouse.new();
    mybank = await DollarBank.new(lighthouse.address);
    await lighthouse.changeSearcher(mybank.address);
  });

  // Write to lighthouse
  it("should write a value into lighthouse", async () => {
    let dataValue = 6;
    let nonce = 1234;
    let luckyNum = 0;

    await lighthouse.write(dataValue, nonce);
    const result = await lighthouse.peekData();
    luckyNum = result[0];
    assert.equal(dataValue, luckyNum, "write to lighthouse failed");
  });

  // read from the lighthouse. data read would be value written above
  it("should read a value from the lighthouse", async () => {
    const result = await lighthouse.peekData();
    value = result[0];
    assert.equal(6, value, "reading from lighthouse failed");
  });

  // read last nonce written to lighthouse
  it("should read the last nonce written to the lighthouse", async () => {
    const result = await lighthouse.peekLastNonce();
    value = result[0];
    assert.equal(1234, value, "reading nonce from lighthouse failed");
  });

  // Check poke function was called. If called, it would have written '6' to bank contract.
  it("should check poke function was called", async () => {
    const value = await mybank.tenCents();
    assert.equal(value, 6, "poke() function was not called");
  });

  // checks that data written in test 1 above is valid.
  it("should test data written to lighthouse is valid", async () => {
    const result = await lighthouse.peekData();
    value = result[1];
    assert.isTrue(value, "data is not valid");
  });
});
