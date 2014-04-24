var colors = require('colors');
var file = 'system.json';
var common = require('./common')(file);

exports.name = 'E'.bold + 'iffel ' + 'P'.bold + 'ackage ' + 'M'.bold + 'anager';
exports.file = file;
exports.version = common.version;
exports.bump = common.bump;
