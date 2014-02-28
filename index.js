var fs = require('fs');
var path = require('path');
var semver = require('semver');
var shell = require('shelljs');
var inquirer = require('inquirer');

function bump(filenames, version) {
  filenames.forEach(function(filename) {
    var pkg = require(path.join(process.cwd(), filename));
    pkg.version = version;
    fs.writeFileSync(filename, JSON.stringify(pkg, null, '  ') + '\n');
  });
}

function run(cmd, msg) {
  shell.exec(cmd, {silent: true});
  console.log(msg);
}

function release(type, callback) {
  var type = type || 'patch'
  var pkg = require(path.join(process.cwd(), 'package.json'));
  var newVersion = semver.inc(pkg.version, type) || type;
  var tag = 'v' + newVersion;
  var filenames = ['package.json'];
  if (fs.existsSync('system.json')) {
    filenames.push('system.json');
  }
  inquirer.prompt([{
    type: 'confirm',
    name: 'confirmation',
    message: 'Do you want to create tag ' + tag + '?',
  default: false
  }], function(answers) {
    if (answers.confirmation) {
      bump(filenames, newVersion);
      console.log('Version bumped to ' + newVersion);
      shell.exec('git add ' + filenames.join(' '));
      run('git commit -m "Version ' + newVersion + '"', filenames.join(' ') + ' committed');
      run('git tag -a ' + tag + ' -m "Tag ' + tag + '"', 'Tag ' + tag + ' created');
      run('git push', 'Pushed to remote');
      run('git push --tags', 'Pushed new tag ' + tag + ' to remote');
    }
    callback();
  });

}

module.exports = release;
