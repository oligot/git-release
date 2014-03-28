var npm = require('./npm');
var epm = require('./epm');
var maven = require('./maven');

exports.npm = npm;
exports.epm = epm;
exports.maven = maven;
exports.all = [ epm, npm, maven ];
