/*global Web3*/

const __embarkWeb3 = {};

__embarkWeb3.init = function (_config) {
  this.web3 = new Web3();
};

__embarkWeb3.getAccounts = function () {
  return this.web3.eth.getAccounts(...arguments);
};

__embarkWeb3.getNewProvider = function (providerName, ...args) {
  return new Web3.providers[providerName](...args);
};

__embarkWeb3.setProvider = function (provider) {
  return this.web3.setProvider(provider);
};

__embarkWeb3.getCurrentProvider = function () {
  return this.web3.currentProvider;
};

__embarkWeb3.getDefaultAccount = function () {
  return this.web3.eth.defaultAccount;
};

__embarkWeb3.setDefaultAccount = function (account) {
  this.web3.eth.defaultAccount = account;
};


