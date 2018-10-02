const config = {
  
};

const fs = require('../../core/fs');
const path = require('path');

class Contracts {
  constructor(options){
    this.events = options.events;
    this.embark = options.embark;
  }

  run() {
    // this.embark.registerContractConfiguration(config);
    const files = fs.readdirSync('contracts/**/*.sol', {cwd: __dirname});
    files.forEach(file => {
      this.events.request("config:contractsFiles:add", this.embark.pathToFile(file));
    });
    
  }
}

module.exports = Contracts;
