var path = require('path');
var chalk = require('chalk');
var WebpackDevServer = require('webpack-dev-server');

var WebpackDevConfig = require('../config/webpack.config.dev');

var openBrowser = require('./openBrowser');
var clearConsole = require('./clearConsole');
var setupCompiler = require('./setupCompiler');
var applyProxyModdileware = require('./applyProxyModdileware');

var isInteractive = process.stdout.isTTY;

function runDevServer(config) {
  var server = config.server;
  var protocol = 'http';
  var host = server.host;
  var port = server.port;
  var proxy = server.proxy;
  var webpackConfig = WebpackDevConfig(config);
  compiler = setupCompiler(webpackConfig, {
    host: host,
    port: port,
    protocol: protocol
  });
  var devServer = new WebpackDevServer(compiler, {
    compress: true,
    clientLogLevel: 'none',
    contentBase: [
      config.context,
      config.output.dll,
    ],
    watchContentBase: false,
    hot: true,
    quiet: true,
    watchOptions: {
      ignored: /node_modules/
    },
    https: protocol === "https",
    host: host,
    port: port,
    inline: true,
    overlay: true,
    historyApiFallback: true,
  });

  if (proxy) {
    applyProxyModdileware(devServer, proxy);
  }

  devServer.listen(port, (err, result) => {
    if (err) {
      return console.log(err);
    }

    if (isInteractive) {
      clearConsole();
    }
    console.log(chalk.cyan('Starting the development server...'));
    console.log();

    openBrowser(protocol + '://' + host + ':' + port + '/');
  });
}

module.exports = runDevServer;
