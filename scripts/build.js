// Do this as the first thing so that any code reading it knows the right env.
process.env.NODE_ENV = 'production';

var fs = require('fs');
var path = require('path');
var rimraf = require('rimraf');
var argv = require('yargs').argv;

var configProcess = require('../utils/configProcess');
var buildDll = require('../utils/buildDll');
var buildProduction = require('../utils/buildProduction');

var context = fs.realpathSync(process.cwd());
var configList = require(path.resolve(context, argv.config));
if (!Array.isArray(configList)) {
  configList = [configList];
}

function build(configs, index) {
  if (!configs || index >= configs.length || !configs[index]) {
    return;
  }
  var config = configs[index];
  var dllConfig = configProcess(config, 'dll');
  var buildConfig = configProcess(config, 'production');
  rimraf(buildConfig.output.build, function () {
    buildDll(dllConfig, function () {
      buildProduction(buildConfig, dllConfig, function (webpackConfig) {
        var listener = buildConfig.listener || {};
        if (typeof listener.afterBuild == 'function') {
          listener.afterBuild(webpackConfig);
        }
        build(configs, index + 1);
      });
    });
  });
}

build(configList, 0);
