const child_process = require('child_process');
const ProcessWrapper = require('../../core/processes/processWrapper');
const constants = require('../../constants');

class Process extends ProcessWrapper {
  constructor(options) {
    super(options);
    this.config = options.config;
    this.startDaemon();
  }

  commands() {
    const commands =  [
      // '-ethPassword', this.config.password
      // '-ethAcctAddr', this.config.accountAddress
      '-datadir', this.config.dataDir
    ];

    switch(this.config.chain) {
      case 'rinkeby':
        commands.push('rinkeby');
        break;
      case 'mainnet':
        break;
      default:
        commands.push('offchain');
        break;
    }
    
    return commands;
  }

  startDaemon() {
    this.child = child_process.spawn(this.config.bin, this.commands());
    this.bindChildEvents();
  }

  kill() {
    if (this.child) {
      this.child.kill();
    }
  }

  bindChildEvents(){
    this.child.on('error', (err) => {
      console.error('Livepeer error: ', err.toString());
    });

    this.child.stderr.on('data', (data) => {
      console.error(data.toString())
    });

    this.child.stdout.on('data', (data) => {
      console.error(data.toString())
    });
    
    this.child.on('exit', (code) => {
      if (code) {
        console.error('Livepeer exited with error code ' + code);
      }
    });
  }
}

let livepeerProcess;

process.on('message', (msg) => {
  if (msg === 'exit') {
    return livepeerProcess.kill();
  }
  if (msg.action === constants.storage.init) {
    livepeerProcess = new Process(msg.options);
  }
});
