const ProcessLauncher = require('./processLauncher');
const Contracts = require('./contracts');

class Livepeer {
  constructor(embark, _options) {
    this.env = embark.env;
    this.logger = embark.logger;
    this.events = embark.events;
    this.config = embark.config.livepeerConfig;
    this.embark = embark;

    if(!this.config.enabled) return;
    this.addContracts();
    this.startProcess();
  }

  startProcess() {
    

    // new ProcessLauncher({
    //   config: this.config,
    //   logger: this.logger,
    //   env: this.env,
    //   events: this.events
    // }).startLivepeerNode();
  }

  addContracts() {
    this.events.once("web3Ready", () => {
      new Contracts({
        events: this.events,
        embark: this.embark
      }).run();
    });
  }
}

module.exports = Livepeer;
