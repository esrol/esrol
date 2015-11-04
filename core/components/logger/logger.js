'use strict';
module.exports = {
  _fs: null,    
  _file: null,    
  _mode: null,    
  _folder: null,    
  _stream: null,    
  _colors: null,    
  _format: null,    
  _shouldConsoleLog: false,   

  initLogger: function(app) {
    var config = app.config;
    this._mode = 'debug';
    this._fs = app.vendors.fs;
    this._format = app.vendors.util.format;
    this._folder = app.vendors.path.join(config.paths.appPath, 'logs'); 
    this._env = config.environment,                     
    this._colors = app.vendors.colors;
    this._configOnEvnironment(config);
    this._shouldDebug(config);    
    this._createStream(this._mode, this._folder);
    return this;
  },

  /**
   * Log output message.
   * @param {Array} args
   * @api private
   */    
  emergency: function() {
    var args = new Array(arguments.length);
    for(var i = 0; i < args.length; ++i) {
      args[i] = arguments[i];
    }      
    this._log('EMERGENCY', args, 'red', 'bold');
  },

  /**
   * Log alert `msg`.
   *
   * @param  {String} msg
   * @api public
   */

  alert: function() {
    var args = new Array(arguments.length);
    for(var i = 0; i < args.length; ++i) {
      args[i] = arguments[i];
    }      
    this._log('ALERT', args, 'yellow', 'bold');
  },

  /**
   * Log critical `msg`.
   *
   * @param  {String} msg
   * @api public
   */

  critical: function() {
    var args = new Array(arguments.length);
    for(var i = 0; i < args.length; ++i) {
      args[i] = arguments[i];
    }      
    this._log('CRITICAL', args, 'red', 'bold');
  },

  /**
   * Log error `msg`.
   *
   * @param  {String} msg
   * @api public
   */

  error: function() {
    var args = new Array(arguments.length);
    for(var i = 0; i < args.length; ++i) {
      args[i] = arguments[i];
    }      
    this._log('ERROR', args, 'red', 'bold');
  },

  /**
   * Log warning `msg`.
   *
   * @param  {String} msg
   * @api public
   */

  warning: function() {
    var args = new Array(arguments.length);
    for(var i = 0; i < args.length; ++i) {
      args[i] = arguments[i];
    }      
    this._log('WARNING', args, 'yellow', 'bold');
  },

  /**
   * Log notice `msg`.
   *
   * @param  {String} msg
   * @api public
   */

  notice: function() {
    var args = new Array(arguments.length);
    for(var i = 0; i < args.length; ++i) {
      args[i] = arguments[i];
    }      
    this._log('NOTICE', args, 'cyan', 'bold');
  },

  /**
   * Log info `msg`.
   *
   * @param  {String} msg
   * @api public
   */

  info: function() {      
    var args = new Array(arguments.length);
    for(var i = 0; i < args.length; ++i) {
      args[i] = arguments[i];
    }      
    this._log('INFO', args, 'cyan', 'bold');
  },


  /**
   * Log success `msg`.
   *
   * @param  {String} msg
   * @api public
   */

  success: function() {    
    var args = new Array(arguments.length);
    for(var i = 0; i < args.length; ++i) {
      args[i] = arguments[i];
    }    
    this._log('SUCCESS', args, 'green', 'bold');
  },    

  /**
   * Log  `msg`.
   *
   * @param  {String} msg
   * @api public
   */
  unauthorized: function() {
    var args = new Array(arguments.length);
    for(var i = 0; i < args.length; ++i) {
      args[i] = arguments[i];
    }        
    this._log('UNAUTHORIZED', args, 'yellow', 'bold');
  },

  badrequest: function() {
    var args = new Array(arguments.length);
    for(var i = 0; i < args.length; ++i) {
      args[i] = arguments[i];
    }        
    this._log('BADREQUEST', args, 'white', 'bold');
  }, 
  
  debug: function() {

  },

  _showDebugMessage: function() {
    var args = new Array(arguments.length);
    for(var i = 0; i < args.length; ++i) {
      args[i] = arguments[i];
    }        
    this._log('DEBUG', args, 'grey', 'bold');    
  }, 

  _shouldDebug: function(config) {
    if (config.debug.enabled === true) {
      this.debug = this._showDebugMessage;
    } else {
      this.debug = this._dontShowDebugMessage;
    }      
  }, 

  _dontShowDebugMessage: function() {
    
  }, 

  _createStream: function() {
    this._stream = this._setStream() || process.stdout;
  },

  _log: function(levelStr, args, color, style) {
    this._checkDate();
    var msg = levelStr + ': ' + this._format.apply(null, args);
    this._stream.write(
        '[' + new Date + ']'
      + ' ' + msg
      + '\n'
    );
    if (this._shouldConsoleLog) {
      console.log (this._colors[style][color](msg))            
    }
  }, 

  _configOnEvnironment: function(config) {
    if (config.environment === 'development') {
      this._shouldConsoleLog = true;
    }     
  }, 

  _fileByDate :  function () {
    var d = new Date();
    return this._folder + '/' + d.getDate() + '-' + (d.getMonth() + 1 ) + '-' + d.getFullYear() + '.log';
  },

  _setStream :  function () {
    this._file = this._fileByDate();
    return this._fs.createWriteStream(this._file, { flags: 'a' });        
  },

  _endStream: function () {
    this._stream.end();
  },    

  _checkDate: function () {
    if (this._file != this._fileByDate()) {
      this._endStream();
      this._stream = this._setStream();
    }
  }        
}; 