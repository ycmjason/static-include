var fs = require('fs');

var chokidar = require('chokidar');

var options = require('./options');
var Compiler = require('./lib/Compiler');
var Config = require('./lib/Config');
var utils = require('./lib/utils');

function registerRules(compiler, rules){
  rules.forEach((rule) => compiler.rule(rule));
}

function getSIFiles(config, dirs){
  sifiles = [];
  dirs.forEach((dir) => {
    files = utils.readdir_r(dir).filter((dir) => config.isSIFile(dir));
    sifiles = sifiles.concat(files);
  });

  return sifiles;
}

function compileFileFactory(config, compiler){
  return (path) => {
    var content = fs.readFileSync(path, 'utf8');
    var si_identifier = config.si_identifier;
    var si_identifier_replacement = config.si_identifier_replacement;
    var compiled_file_name = path.replace(si_identifier, si_identifier_replacement);

    fs.writeFileSync(compiled_file_name, compiler.compile(content));
    console.log('Compiled `' + path + '` > `' + compiled_file_name) + '`';
  }
}

options.config = new Config(require(options.config));

var compiler = new Compiler();

registerRules(compiler, options.config.rules);

var compileFile = compileFileFactory(options.config, compiler);

sifiles = getSIFiles(options.config, options.dirs);

if(sifiles.length <= 0){
  console.log('No si files found.');
  process.exit();
}

if(options.watch){
  var showWaching = () => {
    console.log();
    console.log('Watching files:');
    console.log(sifiles);
    console.log();
  };
  var sifiles_watcher = chokidar.watch(sifiles);  
  sifiles_watcher
    .on('change', compileFile)
    .on('add', compileFile)
    .on('ready', function(){
      showWaching();
    });
}else{
  sifiles.forEach(compileFile);
}
