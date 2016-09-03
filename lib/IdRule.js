var nl = require('os').EOL;

/**
 * Initialise a new `IdRule`, a special kind of rule that does nothing.
 * Id is borrowed from haskell's id function.
 *
 * @return {IdRule} - return a new rule.
 * @api public
 */

function IdRule(){ }

IdRule.prototype.apply = function(line){
  return line;
};

IdRule.prototype.applicable = function(line){
  return true;
}

module.exports = IdRule;
