var argv = require('yargs').argv;
if (argv.p) {
  process.env.NODE_ENV = 'production';
} else {
  process.env.NODE_ENV = 'development';
}

var fs = require('fs');
var path = require('path');

var printErrors = require('../utils/printErrors');
var configProcess = require('../utils/configProcess');
var setupCompiler = require('../utils/setupCompiler');
var dllVersion = require('../utils/dllVersion');
var WebpackDllConfig = require('../config/webpack.config.dll');

var context = fs.realpathSync(process.cwd());
var config = require(path.resolve(context, argv.config));
config = configProcess(config);

function prebuild(index) {
  if (!config.chunks[index]) {
    return;
  }
  if (!dllVersion.isExpired(config.output.dll, config.chunks[index])) {
    prebuild(index + 1)
    return;
  } else {
    var webpackConfig = WebpackDllConfig(config, index);
    var webpackCompiler = setupCompiler(webpackConfig)
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
      prebuild(index + 1);
    });
  }
}

prebuild(0);
