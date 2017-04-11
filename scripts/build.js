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
var config = require(path.resolve(context, argv.config));
var dllConfig = configProcess(config, 'dll');
var buildConfig = configProcess(config, 'production');

rimraf(buildConfig.output.build, function () {
  buildDll(dllConfig, function () {
    buildProduction(buildConfig, function (webpackConfig) {
      var listener = buildConfig.listener || {};
      if (typeof listener.afterBuild == 'function') {
        listener.afterBuild(webpackConfig);
      }
    });
  });
});
