/*global Web3*/

const __embarkWeb3 = {};

__embarkWeb3.init = function (_config) {
  // Actually set web3
  this.web3 = new Web3();
};

__embarkWeb3.getAccounts = function () {
  return this.web3.eth.getAccounts(...arguments);
};
