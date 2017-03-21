var path = require('path');
var chalk = require('chalk');
var nproxy = require('nproxy');
var parse = require('url-parse');
var express = require('express');
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
  var publicPath = parse(config.output.publicPath);
  var webpackConfig = WebpackDevConfig(config);
  compiler = setupCompiler(webpackConfig, {
    host: host,
    port: port,
    protocol: protocol,
  });
  var devServer = new WebpackDevServer(compiler, Object.assign({
    contentBase: [
      config.context,
    ],
    compress: true,
    inline: true,
    hot: true,
    quiet: true,
    noInfo: true,
    clientLogLevel: 'none',
    watchContentBase: false,
    watchOptions: {
      ignored: /node_modules/
    },
    publicPath: config.output.publicPath,
    https: protocol === "https",
    headers: {
      // fix CORS policy
      'Access-Control-Allow-Origin': '*',
    },
    host: host,
    port: port,
    overlay: true,
    historyApiFallback: false,
    setup: function (app) {
      // server dll assets
      app.use(publicPath.pathname, express.static(config.output.dll, {
        setHeaders: function (res) {
          // fix CORS policy
          res.header('Access-Control-Allow-Origin', '*');
        },
      }));
    },
  }, config.server.original));

  if (proxy) {
    applyProxyModdileware(devServer, proxy);
  }

  if (server.nproxy) {
    nproxy(8989, {
      "responderListFilePath": server.nproxy,
      "timeout": 5000,
      "debug": false,
      "networks": false,
    });
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

    // TODO
    // openBrowser(protocol + '://' + host + ':' + port + '/');
  });
}

module.exports = runDevServer;
