var fs = require('fs');
var path = require('path');
var argv = require('yargs').argv;
var webpack = require('webpack');

var context = fs.realpathSync(process.cwd());
var config = require(path.resolve(context, argv.config));

webpack(config, function (err, stats) {
  if (err) {
    console.log(err);
    return;
  }
  console.log(stats.toString());
});
