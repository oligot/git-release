var fs = require('fs');
var path = require('path');

exports = module.exports = function(file) {

  function package() {
    return require(path.join(process.cwd(), file));
  }

  function version() {
    return package().version;
  }

  function bump(version) {
    var pkg = package();
    pkg.version = version;
    fs.writeFileSync(path.join(process.cwd(), file), JSON.stringify(pkg, null, '  ') + '\n');
  }

  return {
    package: package,
    version: version,
    bump: bump
  };
};

