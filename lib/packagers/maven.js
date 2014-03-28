var fs = require('fs');
var path = require('path');
var xmldom = require('xmldom');

var file = 'pom.xml';

function publishable() {
  return false;
}

function version() {
  var pom = fs.readFileSync(path.join(process.cwd(), file), 'utf8');
  var doc = new xmldom.DOMParser().parseFromString(pom);
  return doc.documentElement.getElementsByTagName("version")[0].firstChild.data;
}

function bump(version) {
  var filename = path.join(process.cwd(), file);
  var pom = fs.readFileSync(filename, 'utf8');
  var doc = new xmldom.DOMParser().parseFromString(pom);
  doc.documentElement.getElementsByTagName('version')[0].firstChild.data = version;
  fs.writeFileSync(filename, new xmldom.XMLSerializer().serializeToString(doc));
}

exports.name = 'Maven';
exports.file = file;
exports.version = version;
exports.bump = bump;
exports.publishable = publishable;
