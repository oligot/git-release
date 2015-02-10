var fs = require('fs');
var path = require('path');
var xmldom = require('xmldom');

var file = 'pom.xml';

function version() {
  var pom = fs.readFileSync(path.join(process.cwd(), file), 'utf8');
  var doc = new xmldom.DOMParser().parseFromString(pom);
  var versions = doc.documentElement.getElementsByTagName("version");
  for (var i = 0; i < versions.length; i++) {
    if (versions[i].parentNode.localName == "project") {
      return versions[i].firstChild.data;
    }
  }
}

function bump(version, filename) {
  var filename = path.join(process.cwd(), filename);
  var pom = fs.readFileSync(filename, 'utf8');
  var doc = new xmldom.DOMParser().parseFromString(pom);
  var versions = doc.documentElement.getElementsByTagName("version");
  for (var i = 0; i < versions.length; i++) {
    if (versions[i].parentNode.localName == "project") {
      versions[i].firstChild.data = version;
    }
  }
  fs.writeFileSync(filename, new xmldom.XMLSerializer().serializeToString(doc));
}

exports.name = 'Maven';
exports.file = file;
exports.version = version;
exports.bump = bump;
