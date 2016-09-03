var Rule = require('./lib/Rule');

if(require.main === module){
  var options = require('./options');
  var Compiler = require('./lib/Compiler');
  var chokidar = require('chokidar');

} else{
  module.exports = {
    Rule: Rule
  };
}
