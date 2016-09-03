var version = require('./version');
var commander = require('commander');

commander
  .version(version)
  .usage('[options] <files ...>')
  .option('-w, --watch', 'Watch files and compile them as they changes')
  .option('-c, --config <file>', 'The file containing the configuration, default: ./siconfig.js')
  .parse(process.argv);

commander.config = commander.config || './siconfig.js';
module.exports = commander;
