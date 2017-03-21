// Do this as the first thing so that any code reading it knows the right env.
process.env.NODE_ENV = 'production';

var fs = require('fs');
var path = require('path');
var argv = require('yargs').argv;

var printErrors = require('../utils/printErrors');
var configProcess = require('../utils/configProcess');
var setupCompiler = require('../utils/setupCompiler');
var WebpackProdConfig = require('../config/webpack.config.prod');

var context = fs.realpathSync(process.cwd());
var config = require(path.resolve(context, argv.config));
config = configProcess(config);

var webpackConfig = WebpackProdConfig(config);
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
});