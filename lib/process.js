process = require('process');


/**
 * Exit the process. Behaves similar to python's exit.
 *
 * @param {String} msg - message to be printed in stderr
 * @param {String} exitcode
 * @return {IdRule} - return a new rule.
 * @api public
 */

process.exit = (() => {
  var original_exit = process.exit;
  return function(msg, exitcode){
    if(msg){
      console.error(msg);
      original_exit(exitcode == undefined? 1: exitcode);
      return;
    }else{
      original_exit(exitcode == undefined? 0: exitcode);
      return;
    }
  };
})();

module.exports = process;
