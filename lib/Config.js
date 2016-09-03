var Rule = require('./Rule');

var CONFIG_FILE_NOT_OBJECT = 
  'config file does not contain/return an object';

var CONFIG_FILE_RULES_NOT_ARRAY = 
  'config.rules is not an array';
/**
 * Initialise a new `Config` which mainly asserts the shape of the file
 *
 * @param {String} path - path of the config file
 * @return {Config} - return a new rule.
 * @api public
 */

function Config(config){
  // check shape of config
  if(!(config instanceof Object) ||
     Array.isArray(config))
   throw new Error(CONFIG_FILE_NOT_OBJECT);

  // check shape of config.rules
  if(!(config.rules instanceof Object) ||
     !Array.isArray(config.rules))
   throw new Error(CONFIG_FILE_RULES_NOT_ARRAY);

  this.rules = config.rules.map((rule) => new Rule(rule));
  this.si_identifier = config.si_identifier || /\.si\./;
  this.si_identifier_replacement = config.si_identifier_replacement || '.';
}

Config.prototype.isSIFile = function(name){
  return name.match(this.si_identifier) !== null;
}

module.exports = Config;
