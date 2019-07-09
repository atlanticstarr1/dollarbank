var Lighthouse = artifacts.require("./Lighthouse.sol");
var DollarBank = artifacts.require("./DollarBank.sol");

// module.exports = function(deployer, network) {
//   if (network == "rinkeby") {
//     //var address = "0x4A4eB913FA69a7a4c065bD04119d99E9b2728667"; // lighthouse for rate of ten cents of USD in ETH (1x per day)
//     var address = "0x613D2159db9ca2fBB15670286900aD6c1C79cC9a"; //address of RNG lighthouse on rinkeby
//     deployer.deploy(DollarBank, address);
//   } else {
//     // for local testing
//     deployer.deploy(Lighthouse).then(function() {
//       return deployer.deploy(DollarBank, Lighthouse.address);
//     });
//   }
// };

module.exports = async (deployer, network) => {
  let lighthouseInstance;
  let bankInstance;
  // deploy lighthouse first
  await deployer.deploy(Lighthouse);
  lighthouseInstance = await Lighthouse.deployed();
  // deploy bank contract with lighthouse
  await deployer.deploy(DollarBank, lighthouseInstance.address);
  bankInstance = await DollarBank.deployed();
  // set lighthouse seeker to bank address; this tells the lighthouse which contract to call
  // when the lighthouse data changes
  lighthouseInstance.changeSearcher(bankInstance.address);
};
