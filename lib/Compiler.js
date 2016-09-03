var Rule = require('./Rule');
var IdRule = require('./IdRule');
var utils = require('./utils');
var nl = require('os').EOL;

/**
 * Initialise a new `Compiler`
 *
 * @return {Compiler} - return a new compiler.
 * @api public
 */

function Compiler(){
  this.defaultRule = new IdRule();
  this.rules = [];
}

/**
 * Register a new rule to the compiler
 *
 * @param {String} name - the name of the rule.
 * @param {Rule} rule - the rule object.
 * @return {Compiler} - return itself.
 * @api public
 */

Compiler.prototype.rule = function(name, rule){
  this.rules.push(rule);
  return this;
};

/**
 * Compile a text with the registered rules
 *
 * @param {String} text - the text to compile.
 * @return {String} - compiled text.
 * @api public
 */

Compiler.prototype.compile = function(text){
  lines = splitLines(text);
  lines.map((line) => this._compileLine(line));
  return lines.join(nl);
};

/**
 * Compile a line with the registered rules
 *
 * @param {String} line - the line to compile.
 * @return {String} - compiled line.
 * @api private
 */

Compiler.prototype._compileLine = function(line){
  rule = this._findRule(line);
  return rule.apply(line);
};

/**
 * Find the rule that compiles the line.
 * If more than one rule is applicable, the last one added will be returned.
 *
 * @param {String} line - the line to compile.
 * @return {Rule} - the Rule that compiles that line.
 * @api private
 */

Compiler.prototype._findRule = function(line){
  applicable_rule = this.defaultRule;

  this.rules.forEach((rule) => {
    if(rule.applicable(line)) applicable_rule = rule;
  });

  return applicable_rule;
};
