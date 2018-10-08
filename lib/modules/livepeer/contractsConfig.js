const Web3 = require('web3');
const BigNumber = require("bignumber.js");

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
    requestAmount: new BigNumber(10).mul(TOKEN_UNIT),
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
      "AdjustableRoundsManager": {
        "deploy": false
      },
      "BasicToken": {
        "deploy": false
      },
      "BondingManager": {
        "deploy": false
      },
      "BondingManagerV3": {
        "deploy": false
      },
      "EarningsPool": {
        "deploy": false
      },
      "EarningsPoolFixture": {
        "deploy": false
      },
      "EarningsPoolV1": {
        "deploy": false
      },
      "ECRecovery": {
        "deploy": false
      },
      "ERC20": {
        "deploy": false
      },
      "ERC20Basic": {
        "deploy": false
      },
      "GenericMock": {
        "deploy": false
      },
      "GenesisManager": {
        "deploy": false
      },
      "IdentityVerifier": {
        "deploy": false
      },
      "JobLib": {
        "deploy": false
      },
      "JobsManager": {
        "deploy": false
      },
      "Manager": {
        "deploy": false
      },
      "ManagerProxy": {
        "deploy": false
      },
      "ManagerProxyTarget": {
        "deploy": false
      },
      "ManagerProxyTargetMockV1": {
        "deploy": false
      },
      "ManagerProxyTargetMockV2": {
        "deploy": false
      },
      "ManagerProxyTargetMockV3": {
        "deploy": false
      },
      "Math": {
        "deploy": false
      },
      "MathUtils": {
        "deploy": false
      },
      "MerkleMine": {
        "deploy": false
      },
      "MerkleProof": {
        "deploy": false
      },
      "Migrations": {
        "deploy": false
      },
      "MintableToken": {
        "deploy": false
      },
      "Ownable": {
        "deploy": false
      },
      "Pausable": {
        "deploy": false
      },
      "RevertProxy": {
        "deploy": false
      },
      "RoundsManager": {
        "deploy": false
      },
      "SafeERC20": {
        "deploy": false
      },
      "SafeMath": {
        "deploy": false
      },
      "ServiceRegistry": {
        "deploy": false
      },
      "SortedDoublyLL": {
        "deploy": false
      },
      "SortedDoublyLLFixture": {
        "deploy": false
      },
      "StandardToken": {
        "deploy": false
      },
      "TokenDistributionMock": {
        "deploy": false
      },
      "TokenTimelock": {
        "deploy": false
      },
      "TokenVesting": {
        "deploy": false
      },
      "VariableSupplyToken": {
        "deploy": false
      },
      "Controller": {
        "deploy": true,
        "silent": false
      },
      "LivepeerToken": {
        "deploy": true,
        "silent": false
      },
      "Minter": {
        "deploy": true,
        "silent": false,
        "args": ['$Controller', config.minter.inflation, config.minter.inflationChange, config.minter.targetBondingRate]
      },
      "LivepeerVerifier": {
        "deploy": true,
        "silent": false,
        "args": ["$Controller", config.verifier.solver, config.verifier.verificationCodeHash]
      },
      "LivepeerTokenFaucet": {
        "deploy": true,
        "silent": false,
        "args": ["$LivepeerToken", config.faucet.requestAmount, config.faucet.requestWait]
      },
      "BondingManagerTarget": {
        "instanceOf": "BondingManager",
        "deploy": true,
        "silent": false,
        "args": ["$Controller"]
      },
      "BondingManagerProxy": {
        instanceOf: "ManagerProxy",
        "deploy": true,
        "silent": false,
        "args": ["$Controller", contractId("BondingManagerTarget")]
      },
      "JobsManagerTarget": {
        "instanceOf": "JobsManager",
        "deploy": true,
        "silent": false,
        "args": ["$Controller"]
      },
      "JobsManagerProxy": {
        instanceOf: "ManagerProxy",
        "deploy": true,
        "silent": false,
        "args": ["$Controller", contractId("JobsManagerTarget")]
      },
      "RoundManagerTarget": {
        "instanceOf": "AdjustableRoundsManager",
        "deploy": true,
        "silent": false,
        "args": ["$Controller"]
      },
      "RoundManagerProxy": {
        instanceOf: "ManagerProxy",
        "deploy": true,
        "silent": false,
        "args": ["$Controller", contractId("RoundManagerTarget")]
      },
      "ServiceRegistryTarget": {
        "instanceOf": "ServiceRegistry",
        "deploy": true,
        "silent": false,
        "args": ["$Controller"]
      },
      "ServiceRegistryProxy": {
        instanceOf: "ManagerProxy",
        "deploy": true,
        "silent": false,
        "args": ["$Controller", contractId("ServiceRegistry")]
      }
    },
    "afterDeploy": [
      `await Controller.methods.setContractInfo('${contractId("Minter")}', '$Minter', '1')`,
      `await Controller.methods.setContractInfo('${contractId("LivepeerVerifier")}', '$LivepeerVerifier', '1')`,
      `await Controller.methods.setContractInfo('${contractId("LivepeerToken")}', '$LivepeerToken', '1')`,
      `await Controller.methods.setContractInfo('${contractId("LivepeerTokenFaucet")}', '$LivepeerTokenFaucet', '1')`,
      `await Controller.methods.setContractInfo('${contractId("BondingManagerProxy")}', '$BondingManagerProxy', '1')`,
      `await Controller.methods.setContractInfo('${contractId("JobsManagerProxy")}', '$JobsManagerProxy', '1')`,
      `await Controller.methods.setContractInfo('${contractId("RoundManagerProxy")}', '$RoundManagerProxy', '1')`,
      `await Controller.methods.setContractInfo('${contractId("ServiceRegistryProxy")}', '$ServiceRegistryProxy', '1')`,
      `await BondingManagerProxy.methods.setUnbondingPeriod(${config.bondingManager.unbondingPeriod})`,
      `await BondingManagerProxy.methods.setNumTranscoders(${config.bondingManager.numTranscoders})`,
      `await BondingManagerProxy.methods.setNumActiveTranscoders(${config.bondingManager.numActiveTranscoders})`,
      `await BondingManagerProxy.methods.setMaxEarningsClaimsRounds(${config.bondingManager.maxEarningsClaimsRounds})`,
      `await JobsManagerProxy.methods.setVerificationRate(${config.jobsManager.verificationRate})`,
      `await JobsManagerProxy.methods.setVerificationPeriod(${config.jobsManager.verificationPeriod})`,
      `await JobsManagerProxy.methods.setVerificationSlashingPeriod(${config.jobsManager.verificationSlashingPeriod})`,
      `await JobsManagerProxy.methods.setFailedVerificationSlashAmount(${config.jobsManager.failedVerificationSlashAmount})`,
      `await JobsManagerProxy.methods.setMissedVerificationSlashAmount(${config.jobsManager.missedVerificationSlashAmount})`,
      `await JobsManagerProxy.methods.setDoubleClaimSegmentSlashAmount(${config.jobsManager.doubleClaimSegmentSlashAmount})`,
      `await JobsManagerProxy.methods.setFinderFee(${config.jobsManager.finderFee})`,
      `await RoundManagerProxy.methods.setRoundLength(${config.roundsManager.roundLength})`,
      `await RoundManagerProxy.methods.setRoundLockAmount(${config.roundsManager.roundLockAmount})`
    ]
  }
};
