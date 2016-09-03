var utils = require('./utils');
var nl = require('os').EOL;

/**
 * Initialise a new `Rule`
 *
 * @param {JSON} rule
 * @return {Rule} - return a new rule.
 * @api public
 */

function Rule(rule){
  this.placeholder = rule.placeholder.trim();
  this.placeholder_RegExp = new RegExp(
    utils.escapeRegExp(this.placeholder)
  );

  this.replacement = rule.replacement.trim();

  this.values = rule.values.map((v) => Array.isArray(v)? v: [v]);
}

/**
 * Apply the rule to the line, return original string if doesn't match
 *
 * @param {String} replacement
 * @return {Rule} - return a new rule.
 * @api public
 */

Rule.prototype.apply = function(line){
  if(this.applicable(line)){
    line = line.trim();
    line.replace(this.placeholder_RegExp, this._generate())
  }
  return line;
};

/**
 * Check if the rule is applicable to the line
 *
 * @param {String} line
 * @return {Boolean}
 * @api public
 */

Rule.prototype.applicable = function(line){
  return line.match(this.placeholder_RegExp);
}

/**
 * Plug values into replacement and join them with new line
 *
 * @return {String}
 * @api private
 */

Rule.prototype._generate = function(){
  return this.values.map((value) => this._generateOne).join(nl);
};

/**
 * Plug value into replacement and return the line
 *
 * @param {[String]} value
 * @return {String}
 * @api private
 */

Rule.prototype._generateOne = function(value){
  var replacement = this.replacement;
  var n = (replacement.match(new RegExp(Rule.VALUE_PLACEHOLDER, 'g')) || []).length;
  var value_placeholder_RegExp = new RegExp(Rule.VALUE_PLACEHOLDER);
  for(var i = 0; i < n; i++){
    replacement = replacement.replace(value_placeholder_RegExp, value[i]);
  }
  return replacement
};

/**
 * This is used to identify the placeholder in this.rule.replacement.
 */
Rule.VALUE_PLACEHOLDER = '{}';

module.exports = Rule;
