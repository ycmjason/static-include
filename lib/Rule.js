var utils = require('./utils');

var MISMATCH_NUMBER_OF_VALUE_PLACEHOLDERS =
  'Number of value placeholders({}) doesn\'t match the shape of values';
var RULE_TEMPLATE_NAME_NOT_FOUND =
  'The given name of rule template is not found';

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

  this.replacement = rule.replacement;

  this.values = rule.values.map((v) => Array.isArray(v)? v: [v]);

  // check if the number of `value placeholders` in `replacement`
  // matches `values[i].length`
  var value_placeholder_RegExp_g = new RegExp(Rule.VALUE_PLACEHOLDER, 'g');
  var value_placeholders = this.replacement.match(value_placeholder_RegExp_g) || []
  this.values.forEach(function(v){
    if(v.length != value_placeholders.length){
      throw new Error(MISMATCH_NUMBER_OF_VALUE_PLACEHOLDERS);
    }
  });
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
    line = line.replace(this.placeholder_RegExp, this._generate())
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
  return this.values.map((v) => this._generateOne(v)).join('');
};

/**
 * Plug value into replacement and return the line
 *
 * @param {[String]} value
 * @return {String}
 * @api private
 */

Rule.prototype._generateOne = function(value){
  var value_placeholder_RegExp = new RegExp(Rule.VALUE_PLACEHOLDER);
  var replacement = this.replacement;
  value.forEach((v) => {
    replacement = replacement.replace(value_placeholder_RegExp, v);
  });
  return replacement;
};

/**
 * Create a rule using the given template name
 *
 * @param {String} name
 * @param {[String] | [[String]]} values
 * @return {(values) => Rule}
 * @api private
 */

Rule.useTemplate = function(name){
  var templates = require('../rule_templates');
  var template = templates[name]
  if(!template) throw new Error(RULE_TEMPLATE_NAME_NOT_FOUND);

  return {
    withValues: (values) => {
      var rule = template;
      rule.values = values;
      return new Rule(rule);
    }
  };

};

// alias for useTemplate
Rule.use = Rule.useTemplate;

/**
 * This is used to identify the placeholder in this.rule.replacement.
 */
Rule.VALUE_PLACEHOLDER = '{}';

module.exports = Rule;
