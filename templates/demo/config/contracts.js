module.exports = {
  // default applies to all environments
  default: {
    // Blockchain node to deploy the contracts
    deployment: {
      host: "localhost", // Host of the blockchain node
      port: 8545, // Port of the blockchain node
      type: "rpc", // Type of connection (ws or rpc),
      // Accounts to use instead of the default account to populate your wallet
      accounts: [
        {
          mnemonic: "word word word word word word word word word word word word",
          balance: "90 ether"
        }
      ]

    },
    // order of connections the dapp should connect to
    dappConnection: [
      "$WEB3",  // uses pre existing web3 object if available (e.g in Mist)
      "ws://localhost:8546",
      "http://localhost:8545"
    ],
    gas: "auto",
    contracts: {
      ewasm_precompile_identity: {
        fromIndex: 0
      }
    }
  }
};
