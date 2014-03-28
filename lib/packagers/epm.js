var colors = require('colors');
var file = 'system.json';
var common = require('./common')(file);

function publishable() {
  return false;
}

exports.name = 'E'.bold + 'iffel ' + 'P'.bold + 'ackage ' + 'M'.bold + 'anager';
exports.file = file;
exports.version = common.version;
exports.bump = common.bump;
exports.publishable = publishable;
