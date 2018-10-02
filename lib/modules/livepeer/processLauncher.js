const shellJs = require('shelljs');

const MainProcessLauncher = require('../../core/processes/processLauncher');
const utils = require('../../utils/utils');
const constants = require('../../constants');

class ProcessLauncher {
  constructor(options) {
    this.env = options.env;
    this.logger = options.logger;
    this.events = options.events;
    this.config = options.config;
  }

  processEnded(code) {
    this.logger.error(__('Livepeer process ended before the end of this process. Code: %s', code));
  }

  startLivepeerNode() {
    const program = shellJs.which(this.config.bin);
    if (!program) {
      this.logger.warn(__('livepeer is not installed or your configuration is not right'));
      this.logger.info(__('You can install and get more information here: https://github.com/livepeer/go-livepeer').yellow);
    }

    this.logger.info(__('Starting livepeer process').cyan);
  
    this.livepeerProcess = new MainProcessLauncher({
      modulePath: utils.joinPath(__dirname, './process.js'),
      logger: this.logger,
      events: this.events,
      silent: this.logger.logLevel !== 'trace',
      exitCallback: this.processEnded.bind(this)
    });

    this.livepeerProcess.send({
      action: constants.livepeer.init, 
      options: {
        config: this.config,
        env: this.env
      }
    });

    this.livepeerProcess.once('result', constants.livepeer.ready, () => {
      this.logger.info(__('Livepeer node is ready').cyan);
      this.events.emit(constants.livepeer.ready);
    });

    this.livepeerProcess.once('result', constants.livepeer.exit, () => {
      this.events.emit(constants.livepeer.exit);
      this.livepeerProcess.kill();
    });

    this.events.on('exit', () => {
      this.livepeerProcess.send('exit');
    });
  }
}

module.exports = ProcessLauncher;
