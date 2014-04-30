var chalk = require('chalk');
var file = 'system.json';
var common = require('./common')(file);

exports.name = chalk.bold('E') + 'iffel ' + chalk.bold('P') + 'ackage ' + chalk.bold('M') + 'anager';
exports.file = file;
exports.version = common.version;
exports.bump = common.bump;
