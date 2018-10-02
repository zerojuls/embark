const child_process = require('child_process');
const ProcessWrapper = require('../../core/processes/processWrapper');
const constants = require('../../constants');

class Process extends ProcessWrapper {
  constructor(options) {
    super(options);
    this.startDaemon();
  }

  commandArgs() {
    return []
  }

  startDaemon() {
    this.child = child_process.spawn(this.command(), this.commandArgs());
    this.bindChildEvents();
  }

  kill() {
    if (this.child) {
      this.child.kill();
    }
  }

  bindChildEvents(){
    this.child.on('error', (err) => {
      console.error('IPFS error: ', err.toString());
    });

    this.child.stderr.on('data', (data) => {
    });

    this.child.stdout.on('data', (data) => {
      data = data.toString();
    });
    
    this.child.on('exit', (code) => {
      if (code) {
        console.error('IPFS exited with error code ' + code);
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
