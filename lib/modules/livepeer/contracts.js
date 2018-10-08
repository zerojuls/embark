const fs = require('../../core/fs');

const contractsConfig = require('./contractsConfig');

class Contracts {
  constructor(options){
    this.events = options.events;
    this.embark = options.embark;
  }

  run() {
    this.embark.registerContractConfiguration(contractsConfig);
    // this.embark.registerContractConfiguration(config);
    const files = fs.readdirSync('../../../c/**/*.sol', {cwd: __dirname});
    files.forEach(file => {
      this.events.request("config:contractsFiles:add", this.embark.pathToFile(file));
    });
    
  }
}

module.exports = Contracts;
