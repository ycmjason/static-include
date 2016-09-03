var nl = require('os').EOL;

var Rule = require('./Rule');
var IdRule = require('./IdRule');
var utils = require('./utils');

var NOT_RULE_INSTANCE = 'rule must be a instance of Rule';

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
 * @param {Rule} rule - the rule object.
 * @return {Compiler} - return itself.
 * @api public
 */

Compiler.prototype.rule = function(rule){
  if(!(rule instanceof Rule)) throw new Error(NOT_RULE_INSTANCE);

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
  var compiled_text = text;
  this.rules.forEach((rule) => {
    compiled_text = rule.apply(compiled_text);
  });
  return compiled_text;
};

module.exports = Compiler;
