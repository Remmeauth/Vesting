var Vesting = artifacts.require("./Vesting.sol");
var ERC20Token = artifacts.require("./ERC20Token.sol");
var Settings = require("../settings");

// logging line execution
function test() {
    console.log('Test Trace');
    console.trace();
}

contract('Vesting', ([owner]) => {
  beforeEach(async () => {
    tokenInstance = await ERC20Token.new(Settings.TOKEN_SUPPLY, 'REMME', 1, 'REMME')
    vestingInstance = await Vesting.new(tokenInstance.address, Settings.DATES, Settings.DISTRIBUTION);
    await tokenInstance.transfer(vestingInstance.address, TOKEN_SUPPLY);
  })

  it("tests the failure of withdrawal before first date", async () => {
    try {
      await vestingInstance.withdraw()
    } catch (error) {
      assert("Success!");
      return;
    }
    assert.fail('Expected to throw');
  });

  it("tests the failure of withdrawal before second date", async () => {
    try {
      increateTime(Settings.DATES[0] - getCurrentTimestamp() + 1)
      await vestingInstance.withdraw()
      assert(await tokenInstance.balanceOf.call(owner) == Settings.DISTRIBUTION[0])
      await vestingInstance.withdraw()
    } catch (error) {
      assert("Success!");
      return;
    }
    assert.fail('Expected to throw');
  });

  it("withdraw after all dates", async () => {
    let currentBalance = 0;
    for (let i = 0; i < Settings.DATES.length; i++) {
      increateTime(Settings.DATES[i] - getCurrentTimestamp() + 1)
      await vestingInstance.withdraw()
      currentBalance += Settings.DISTRIBUTION[i]
      assert(await tokenInstance.balanceOf.call(owner) >= currentBalance)
    }
  });
});

function getCurrentTimestamp() {
  return web3.eth.getBlock(web3.eth.blockNumber).timestamp;
}

function increateTime(increase_by) {
  web3.currentProvider.send({jsonrpc: "2.0", method: "evm_increaseTime", params: [increase_by], id: 0})
  web3.currentProvider.send({jsonrpc: "2.0", method: "evm_mine", params: [], id: 0})
}
