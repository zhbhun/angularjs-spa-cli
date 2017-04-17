var path = require('path');
var merge = require('webpack-merge');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin');

var WebpackConfig = require('./webpack.config');

function WebpackDevConfig(config, dllConfig) {
  var publicPath = config.output.publicPath;
  return merge(WebpackConfig(config), {
    entry: config.input.reduce(function (entry, input) {
      entry[input.name] = [input.script];
      return entry;
    }, {}),
    output: {
      path: config.output.build,
    },
    plugins: [
      new ExtractTextPlugin({ filename: config.filenames.css }),
    ]
    // chunks
    .concat((function () {
      var plugins = [];
      config.chunks.forEach(function (chunk) {
        var dll = path.resolve(dllConfig.output.dll, chunk.name);
        var assets = require(path.resolve(dll, 'assets.json'));
        var manifest = dllConfig.filenames.manifest.replace('[name]', chunk.name);
        var manifestPath = path.resolve(dll, manifest);
        plugins.push(new webpack.DllReferencePlugin({
          context: config.context,
          manifest: require(manifestPath),
        }));
        plugins.push(new AddAssetHtmlPlugin({
          filepath: path.resolve(dll, assets[chunk.name].js),
          includeSourcemap: false,
          publicPath: publicPath,
          typeOfAsset: 'js',
        }));
        if (assets[chunk.name].css) {
          plugins.push(new AddAssetHtmlPlugin({
            filepath: path.resolve(dll, assets[chunk.name].css),
            includeSourcemap: false,
            publicPath: publicPath,
            typeOfAsset: 'css',
          }));
        }
        plugins.push(new CopyWebpackPlugin([{
          from: dll,
          to: config.output.build,
          ignore: [
            '*.json',
            '*.map',
          ],
        }]));
      });
      return plugins;
    }()))
    // html
    .concat(config.input.map(function (input) {
      var name = input.name;
      var filename = config.filenames.html.replace('[name]', name);
      return new HtmlWebpackPlugin({
        inject: true,
        chunksSortMode: 'dependency',
        template: input.html,
        filename: filename,
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
        chunks: [name],
      });
    })),
  }, config.webpack || {});
}

module.exports = WebpackDevConfig;
