if(require.main === module){ // if run as command
  require('./main');
} else{
  module.exports = {
    Rule: require('./lib/Rule')
  };
}
