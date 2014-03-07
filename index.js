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
  var types = ['major', 'minor', 'patch'];
  var choices = types.map(function (type) {
    var version = semver.inc(pkg.version, type);
    return { name: version + ' (Increment ' + type + ' version)', value: version };
  });
  if (types.indexOf(type) < 0) {
    choices.push({name: newVersion + ' (Custom version)', value: newVersion});
  }
  var filenames = ['package.json'];
  if (fs.existsSync('system.json')) {
    filenames.push('system.json');
  }
  inquirer.prompt([{
    type: 'list',
    name: 'version',
    message: 'Which version do you want to release ?',
    choices: choices.concat([ new inquirer.Separator(), { name: "Exit (Don't release a new version)", value: 'exit' }]),
    default: newVersion
  }], function(answers) {
    var version = answers.version;
    if (version !== 'exit') {
      var tag = 'v' + version;
      bump(filenames, version);
      console.log('Version bumped to ' + version);
      shell.exec('git add ' + filenames.join(' '));
      run('git commit -m "Version ' + version + '"', filenames.join(' ') + ' committed');
      run('git tag -a ' + tag + ' -m "Tag ' + tag + '"', 'Tag ' + tag + ' created');
      run('git push', 'Pushed to remote');
      run('git push --tags', 'Pushed new tag ' + tag + ' to remote');
    }
    callback();
  });

}

module.exports = release;
