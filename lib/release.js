var fs = require('fs');
var path = require('path');
var semver = require('semver');
var shell = require('shelljs');
var inquirer = require('inquirer');
var packagers = require('./packagers');
require('array.prototype.find');

function bump(filenames, version) {
  filenames.forEach(function(filename) {
    var packager = packagers.all.find(function (pack) { return pack.file == path.basename(filename); });
    if (packager) {
      packager.bump(version, filename);
    }
  });
}

function hook(name) {
  var hook = path.join('.git', 'hooks', name);
  if (fs.existsSync(hook)) {
    shell.exec(hook);
  }
}

function git(version, tag, filenames) {
  hook('pre-release');
  shell.exec('git add ' + filenames.join(' '));
  run('git commit -m "Version ' + version + '"', filenames.join(' ') + ' committed');
  run('git tag -a ' + tag + ' -m "Tag ' + tag + '"', 'Tag ' + tag + ' created');
  run('git push', 'Pushed to remote');
  run('git push --tags', 'Pushed new tag ' + tag + ' to remote');
  hook('post-release');
}

function run(cmd, msg) {
  shell.exec(cmd, {silent: true});
  console.log(msg);
}

function release(type, files, callback) {
  var packager;
  packagers.all.forEach(function(pack) {
    if (!packager && fs.existsSync(pack.file)) {
      packager = pack;
    }
  });
  if (!packager) {
    callback(new Error('No packager found !'));
  } else {
    console.log('Using packager', packager.name);
    var type = type || 'patch';
    var currentVersion = packager.version();
    var newVersion = semver.inc(currentVersion, type) || type;
    var types = ['major', 'minor', 'patch'];
    var choices = types.map(function (type) {
      var version = semver.inc(currentVersion, type);
      return { name: version + ' (Increment ' + type + ' version)', value: version };
    });
    if (types.indexOf(type) < 0) {
      choices.push({name: newVersion + ' (Custom version)', value: newVersion});
    }
    var filenames = files || packagers.all.filter(function (pack) {
      return fs.existsSync(pack.file);
    }).map(function (pack) {
      return pack.file;
    });
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
        git(version, tag, filenames);
        callback();
      } else {
        callback();
      }
    });
  }
}

module.exports = release;
