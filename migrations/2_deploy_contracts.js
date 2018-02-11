var ERC20Token = artifacts.require("./ERC20Token.sol");
var Vesting = artifacts.require("./Vesting.sol");
var Settings = require("../settings");

module.exports = async function(deployer) {
  deployer.deploy(ERC20Token, Settings.TOKEN_SUPPLY, 'REMME', 1, 'REMME')
  .then(() => deployer.deploy(Vesting, ERC20Token.address, Settings.DATES, Settings.DISTRIBUTION))
};
