var version = require('./version');
var commander = require('commander');

commander
  .version(version)
  .usage('[options] <files ...>')
  .option('-w, --watch', 'Watch files and compile them as they changes')
  .parse(process.argv);

module.exports = commander;
