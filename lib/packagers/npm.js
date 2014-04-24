var colors = require('colors');
var shell = require('shelljs');
var file = 'package.json';
var common = require('./common')(file);

exports.name = 'N'.bold + 'ode ' + 'P'.bold + 'ackage ' + 'M'.bold + 'anager';
exports.file = 'package.json';
exports.version = common.version;
exports.bump = common.bump;
