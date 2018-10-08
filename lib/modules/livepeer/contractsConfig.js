const Web3 = require('web3');

const TOKEN_UNIT = 10 ** 18;

const config = {
  bondingManager: {
    numTranscoders: 20,
    numActiveTranscoders: 10,
    unbondingPeriod: 7,
    maxEarningsClaimsRounds: 20
  },
  jobsManager: {
    verificationRate: 1000,
    verificationPeriod: 100,
    verificationSlashingPeriod: 100,
    failedVerificationSlashAmount: 1,
    missedVerificationSlashAmount: 5000,
    doubleClaimSegmentSlashAmount: 30000,
    finderFee: 50000
  },
  roundsManager: {
    roundLength: 5760,
    roundLockAmount: 100000
  },
  faucet: {
    requestAmount: Web3.utils.toBN(10) * TOKEN_UNIT,
    requestWait: 1,
    whitelist: []
  },
  minter: {
    inflation: 137,
    inflationChange: 3,
    targetBondingRate: 500000
  },
  verifier: {
    verificationCodeHash: "QmUMk1wF6YmFLFyydhSVgeNCSKk4J8G38DzTzcx6FdYSzV",
    solver: "0xc613674f1876eeb89821bcaa9CfC5B9299BACBF2",
    gasPrice: 20000000000,
    gasLimit: 3000000
  }
};

const contractId = (name) => {
  return Web3.utils.toHex(Web3.utils.soliditySha3(name));
};

module.exports = {
  "default": {
    "gas": "auto",
    "contracts": {
      "Controller": {
        "deploy": true,
        "silent": false
      },
      "LivepeerToken": {
        "deploy": true,
        "silent": false,
        "args": [],
        "onDeploy": [
          `Controller.methods.setContractInfo('${contractId("LivepeerToken")}', '$LivepeerToken', '1')`
        ]
      },
      "Minter": {
        "deploy": true,
        "silent": false,
        "args": ['$Controller', config.minter.inflation, config.minter.inflationChange, config.minter.targetBondingRate],
        "onDeploy": [
          `Controller.methods.setContractInfo('${contractId("Minter")}', '$Minter', '1')`
        ]
      },
      "LivepeerVerifier": {
        "deploy": true,
        "silent": false,
        "args": ["$Controller", config.verifier.solver, config.verifier.verificationCodeHash],
        "onDeploy": [
          `Controller.methods.setContractInfo('${contractId("LivepeerVerifier")}', '$LivepeerVerifier', '1')`
        ]
      },
      "LivepeerTokenFaucet": {
        "deploy": true,
        "silent": false,
        "args": ["$LivepeerToken", config.faucet.requestAmount, config.faucet.requestWait],
        "onDeploy": [
          `Controller.methods.setContractInfo('${contractId("LivepeerTokenFaucet")}', '$LivepeerTokenFaucet', '1')`
        ]
      },
      "BondingManagerTarget": {
        "instanceOf": "BondingManager",
        "deploy": true,
        "silent": false,
        "args": ["$Controller"]
      },
      "BondingManager": {
        instanceOf: "ManagerProxy",
        "deploy": true,
        "silent": false,
        "args": ["$Controller", contractId("BondingManagerTarget")],
        "onDeploy": [
          `Controller.methods.setContractInfo('${contractId("BondingManager")}', '$BondingManager', '1')`
        ]
      },
      "JobManagerTarget": {
        "instanceOf": "JobManager",
        "deploy": true,
        "silent": false,
        "args": ["$Controller"]
      },
      "JobManager": {
        instanceOf: "ManagerProxy",
        "deploy": true,
        "silent": false,
        "args": ["$Controller", contractId("JobManagerTarget")],
        "onDeploy": [
          `Controller.methods.setContractInfo('${contractId("JobManager")}', '$JobManager', '1')`
        ]
      },
      "RoundManagerTarget": {
        "instanceOf": "AdjustableRoundsManager",
        "deploy": true,
        "silent": false,
        "args": ["$Controller"]
      },
      "RoundManager": {
        instanceOf: "ManagerProxy",
        "deploy": true,
        "silent": false,
        "args": ["$Controller", contractId("AdjustableRoundsManager")],
        "onDeploy": [
          `Controller.methods.setContractInfo('${contractId("RoundManager")}', '$RoundManager', '1')`
        ]
      },
      "ServiceRegistryTarget": {
        "instanceOf": "ServiceRegistry",
        "deploy": true,
        "silent": false,
        "args": ["$Controller"]
      },
      "ServiceRegistry": {
        instanceOf: "ManagerProxy",
        "deploy": true,
        "silent": false,
        "args": ["$Controller", contractId("ServiceRegistry")],
        "onDeploy": [
          `Controller.methods.setContractInfo('${contractId("ServiceRegistry")}', '$ServiceRegistry', '1')`
        ]
      }
    },
    "afterDeploy": [
      `await BondingManager.methods.setUnbondingPeriod(${config.bondingManager.unbondingPeriod})`,
      `await BondingManager.methods.setNumTranscoders(${config.bondingManager.numTranscoders})`,
      `await BondingManager.methods.setNumActiveTranscoders(${config.bondingManager.numActiveTranscoders})`,
      `await BondingManager.methods.setMaxEarningsClaimsRounds(${config.bondingManager.maxEarningsClaimsRounds})`,
      `await JobManager.methods.setVerificationRate(${config.jobsManager.verificationRate})`,
      `await JobManager.methods.setVerificationPeriod(${config.jobsManager.verificationPeriod})`,
      `await JobManager.methods.setVerificationSlashingPeriod(${config.jobsManager.verificationSlashingPeriod})`,
      `await JobManager.methods.setFailedVerificationSlashAmount(${config.jobsManager.failedVerificationSlashAmount})`,
      `await JobManager.methods.setMissedVerificationSlashAmount(${config.jobsManager.missedVerificationSlashAmount})`,
      `await JobManager.methods.setDoubleClaimSegmentSlashAmount(${config.jobsManager.doubleClaimSegmentSlashAmount})`,
      `await JobManager.methods.setFinderFee(${config.jobsManager.finderFee})`,
      `await RoundManager.methods.setRoundLength(${config.roundsManager.roundLength})`,
      `await RoundManager.methods.setRoundLockAmount(${config.roundsManager.roundLockAmount})`
    ]
  }
};