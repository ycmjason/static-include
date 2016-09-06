var path = require('path');
/**
 * Split the lines in the given string
 *
 * @param {String} s
 * @return {[String]}
 * @api private
 */

exports.splitLines = function(s){
  return s.split(/\n\r|\r\n|\r|\n/g);
}

/**
 * Escape special characters of regexp
 *
 * @param {String} s
 * @return {String}
 * @api private
 */

exports.escapeRegExp = require('escape-string-regexp');

exports.readdir_r = require('fs-readdir-recursive');

exports.rerequire = function(p){
  delete require.cache[path.resolve(p)];
  return require(p);
}
