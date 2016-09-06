var fs = require('fs');
var commander = require('commander');

var version = require('./version');
var process = require('./lib/process');

commander
  .version(version)
  .usage('[options] <dir ...>')
  .option('-w, --watch', 'Watch files and compile them as they changes')
  .option('-c, --config <file>', 'The file containing the configuration, default: ./siconfig.js')
  .parse(process.argv);

// assign program arguments
commander.dirs = commander.args;
if(commander.dirs.length <= 0){
  process.exit('Error: No files is given. See help with `-h`.');
}

// default values
commander.config_path = fs.realpathSync(commander.config || './siconfig.js');

module.exports = commander;
