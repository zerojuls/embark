const ProcessLauncher = require('./processLauncher');

class Livepeer {
  constructor(embark, _options) {
    this.env = embark.env;
    this.logger = embark.logger;
    this.events = embark.events;
    this.config = embark.config.livepeerConfig;
    this.embark = embark;

    this.startProcess();
    this.addContracts();
  }

  startProcess() {
    if(!this.config.enabled) return;

    new ProcessLauncher({
      config: this.config,
      logger: this.logger,
      env: this.env,
      events: this.events
    }).startLivepeerNode();
  }

  addContracts() {

  }
}

module.exports = Livepeer;
