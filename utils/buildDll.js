var rimraf = require('rimraf');

var printErrors = require('./printErrors');
var setupCompiler = require('./setupCompiler');
var dllVersion = require('./dllVersion');
var WebpackDllConfig = require('../config/webpack.config.dll');

function prebuild(config, index, callback) {
  if (!config.chunks[index]) {
    if (typeof callback === 'function') {
      callback();
    }
  } else if (!dllVersion.isExpired(config.output.dll, config.chunks[index])) {
    prebuild(config, index + 1, callback);
  } else {
    var webpackConfig = WebpackDllConfig(config, index);
    var webpackCompiler = setupCompiler(webpackConfig);
    console.log();
    console.log('> ' + config.chunks[index].name + ' building...');
    console.log();
    webpackCompiler.run((err, stats) => {
      if (err) {
        printErrors('Failed to compile.', [err]);
        process.exit(1);
      }

      if (stats.compilation.errors.length) {
        printErrors('Failed to compile.', stats.compilation.errors);
        process.exit(1);
      }

      if (process.env.CI && stats.compilation.warnings.length) {
        printErrors('Failed to compile.', stats.compilation.warnings);
        process.exit(1);
      }

      dllVersion.record(config.output.dll, config.chunks[index]);
      prebuild(config, index + 1, callback);
    });
  }
}

module.exports = function (config, callback) {
  rimraf(config.output.dll, function () {
    prebuild(config, 0, callback);
  });
};
