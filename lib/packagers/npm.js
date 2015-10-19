var chalk = require('chalk');
var file = 'package.json';
var common = require('./common')(file);

exports.name = chalk.bold('N') + 'ode ' + chalk.bold('P') + 'ackage ' + chalk.bold('M') + 'anager';
exports.file = 'package.json';
exports.version = common.version;
exports.bump = common.bump;
