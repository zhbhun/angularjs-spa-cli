var fs = require('fs');
var path = require('path');
var merge = require('webpack-merge');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin');

var names = require('./names').production;
var WebpackConfig = require('./webpack.config');

function WebpackDevConfig(config) {
  var publicPath = config.output.publicPath;
  var plugins = [];
  config.chunks.map(function (chunk) {
    var dll = config.output.dll;
    var manifest = path.resolve(dll, names.manifest.replace('[name]', chunk.name));
    var js = path.resolve(dll, chunk.name + '.js');
    var css = path.resolve(dll, chunk.name + '.css');
    plugins.push(new webpack.DllReferencePlugin({
      context: config.context,
      manifest: require(manifest),
    }));
    plugins.push(new AddAssetHtmlPlugin({
      filepath: js,
      includeSourcemap: true,
      publicPath: publicPath,
      typeOfAsset: 'js',
    }));
    if (fs.existsSync(css)) {
      plugins.push(new AddAssetHtmlPlugin({
        filepath: css,
        includeSourcemap: true,
        publicPath: publicPath,
        typeOfAsset: 'css',
      }));
    }
  });
  return merge(WebpackConfig(config), {
    entry: [
      config.input.script,
    ],
    output: {
      path: config.output.buildPath,
      publicPath: publicPath,
      filename: names.js,
      chunkFilename: names.js,
    },
    plugins: [
      new ExtractTextPlugin({ filename: names.css }),
      new HtmlWebpackPlugin({
        inject: true,
        chunksSortMode: 'dependency',
        template: config.input.html,
        minify: {
          removeComments: true,
          // collapseWhitespace: true,
          removeRedundantAttributes: true,
          useShortDoctype: true,
          removeEmptyAttributes: true,
          removeStyleLinkTypeAttributes: true,
          keepClosingSlash: true,
          // minifyJS: true,
          // minifyCSS: true,
          // minifyURLs: true,
        },
      }),
    ].concat(plugins),
  });
}

module.exports = WebpackDevConfig;
