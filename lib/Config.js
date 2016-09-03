process = require('./process');

/**
 * Initialise a new `Config` which mainly asserts the shape of the file
 *
 * @param {String} path - path of the config file
 * @return {Config} - return a new rule.
 * @api public
 */

function Config(path){
  var config;
  config = require(path);
  
  // check shape of config
  if(!(config instanceof Object) ||
     Array.isArray(config))
   process.exit('config file does not contain/return an object');

  // check shape of config.rules
  if(!(config.rules instanceof Object) ||
     !Array.isArray(config.rules))
   process.exit('config.rules is not an array');

  this.rules = config.rules;
}
