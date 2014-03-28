var colors = require('colors');
var shell = require('shelljs');
var file = 'package.json';
var common = require('./common')(file);

function publishable() {
  return !common.package().private;
}

function publish(callback) {
  shell.exec('npm publish');
  callback();
}

exports.name = 'N'.bold + 'ode ' + 'P'.bold + 'ackage ' + 'M'.bold + 'anager';
exports.file = 'package.json';
exports.version = common.version;
exports.bump = common.bump;
exports.publishable = publishable;
exports.publish = publish;
