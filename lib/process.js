process = require('process');


/**
 * Exit the process. Behaves similar to python's exit.
 *
 * @param {String} msg - message to be printed in stderr
 * @param {String} exitcode
 * @return {IdRule} - return a new rule.
 * @api public
 */

exports.exit = function(msg, exitcode){
  if(msg){
    console.error(msg);
    process.exit(exitcode == undefined? 1: exitcode);
    return;
  } else{
    process.exit(exitcode == undefined? 0: exitcode);
    return;
  }
}
