module.exports = {
  // default applies to all environments
  default: {
    enabled: true,  // Default false
    bin: "/Users/anthony/code/livepeer/livepeer" // Location of the binary, default to 'livepeer'
  },

  development: {
    datadir: '.embark/development/livepeer', // Default to '.embark/<env>/livepeer
    chain: 'dev' // Default to dev, available values are: dev | rinkeby | mainnet
  },

  // merges with the settings in default
  // used with "embark run privatenet"
  privatenet: {
  },

  // merges with the settings in default
  // used with "embark run testnet"
  testnet: {
  },

  // merges with the settings in default
  // used with "embark run livenet"
  livenet: {
  },

  // you can name an environment with specific settings and then specify with
  // "embark run custom_name" or "embark blockchain custom_name"
  //custom_name: {
  //}
};
