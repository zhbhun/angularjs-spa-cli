var argv = require('yargs').argv;
if (argv.p) {
  process.env.NODE_ENV = 'production';
} else {
  process.env.NODE_ENV = 'development';
}

var fs = require('fs');
var path = require('path');

var buildDll = require('../utils/buildDll');
var configProcess = require('../utils/configProcess');

var context = fs.realpathSync(process.cwd());
var config = require(path.resolve(context, argv.config));
config = configProcess(config);

buildDll(config);
