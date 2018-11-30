import {PerformanceObserver, performance} from 'perf_hooks';
import {red} from 'colors';
const utils = require('./utils.js');
import prettyMs from 'pretty-ms';
import { Logger } from '../../../src/typings/logger';
const ora = require('ora');

export default class LongRunningProcessTimer{
  private _logger: Logger;
  private _packageName: string;
  private _version: string;
  private _showSpinner: boolean;
  private _spinnerStyle: string;
  private _interval: number;
  private _processStartingMsg: string;
  private _processOngoingMsg: string;
  private _processFinishedMsg: string;
  private _longRunningThreshold: number;
  private _startMark: string;
  private _ongoingMark: string;
  private _downloadOngoing: string;
  private _endMark: string;
  private _downloadComplete: string;
  private _observer!: PerformanceObserver;
  private _spinner!: any;
  private _intOngoingDownload!: NodeJS.Timeout;

  constructor(logger: Logger, packageName: string, version: string, processStartingMsg: string, processOngoingMsg: string, processFinishedMsg: string, showSpinner?:boolean, spinnerStyle?: string, interval?: number, longRunningThreshold?: number){
    this._logger = (logger && typeof logger.info === 'function') ? logger : console;
    this._packageName = packageName;
    this._version = version;
    this._showSpinner = showSpinner || false;
    this._spinnerStyle = spinnerStyle || "dots";
    this._interval = interval || 750;
    this._processStartingMsg = processStartingMsg;
    this._processOngoingMsg = processOngoingMsg;
    this._processFinishedMsg = processFinishedMsg;
    this._longRunningThreshold = longRunningThreshold || 4000


    // define mark and measurement names
    this._startMark = 'downloadStart' + this._packageName + this._version;
    this._ongoingMark = 'downloadOngoingMark' + this._packageName + this._version;
    this._downloadOngoing = 'downloadOngoing' + this._packageName + this._version;
    this._endMark = 'downloadEnd' + this._packageName + this._version;
    this._downloadComplete = 'downloadComplete' + this._packageName + this._version;

    this.observer.observe({entryTypes: ['measure']});
  }

  get observer(){
    if(typeof this._observer === 'undefined'){
      this._observer = new PerformanceObserver((items) => {
        let entry;
        let strDuration;

        // find any download ongoing measurements we've made
        entry = utils.last(items.getEntries().filter(entry => entry.name === this._downloadOngoing));
        if(entry){
          // ongoing performance mark 
          // TODO: add i18n
          strDuration = this._processOngoingMsg.replace("{{packageName}}", this._packageName).replace("{{version}}", this._version).replace("{{duration}}", prettyMs(entry.duration));
          if(this._spinner) this._spinner.text = strDuration;
        }
        else{
          // otherwise, find our download complete measurement
          entry = utils.last(items.getEntries().filter(entry => entry.name === this._downloadComplete));
          if(entry){
            // TODO: add i18n
            strDuration = this._processFinishedMsg.replace("{{packageName}}", this._packageName).replace("{{version}}", this._version).replace("{{duration}}", prettyMs(entry.duration));
            performance.clearMarks();
            if(this._spinner) this._spinner.succeed(strDuration);
          }
        }

        // log our measurement and make it red if it has taken too long
        if(!this._showSpinner && entry && strDuration){
          if(entry.duration > this._longRunningThreshold){
            strDuration = strDuration.red;
          }
          this._logger.info(strDuration);
        }

      });
    }
    return this._observer;
  }

  start(){
    let self = this;
    // TODO: add i18n
    const strDownloadStart = this._processStartingMsg.replace("{{packageName}}", this._packageName).replace("{{version}}", this._version);
    if(this._showSpinner){
      this._spinner = ora({
        text: strDownloadStart,
        spinner: this._spinnerStyle
      }).start();
    }else{
      this._logger.info(strDownloadStart);
    }

    // mark our start time
    performance.mark(this._startMark);

    // function that continually updates the console to show user that we're downloading a library
    this._intOngoingDownload = setInterval(
      function(){ 
        performance.mark(self._ongoingMark);
        performance.measure(self._downloadOngoing, self._startMark, self._ongoingMark); 
      }, this._interval);
  }

  end(){
    // stop updating console for ongoing download
    clearInterval(this._intOngoingDownload);
    performance.mark(this._endMark);
    performance.measure(this._downloadComplete, this._startMark, this._endMark);
  }
}

module.exports = LongRunningProcessTimer;
