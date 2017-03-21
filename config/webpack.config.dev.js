var fs = require('fs');
var path = require('path');
var parse = require('url-parse');
var webpack = require('webpack');
var merge = require('webpack-merge');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlWebpackIncludeAssetsPlugin = require('html-webpack-include-assets-plugin');

var WebpackConfig = require('./webpack.config');

function WebpackDevConfig(config) {
  var publicPath = config.output.publicPath;
  var publicUrl = parse(publicPath).origin + '/';
  var plugins = [];
  config.chunks.map(function (chunk) {
    var dll = config.output.dll;
    var manifest = config.filenames.manifest.replace('[name]', chunk.name);
    var manifestPath = path.resolve(dll, manifest);
    var js = config.filenames.js.replace('[name]', chunk.name);
    var jsPath = path.resolve(dll, js);
    var css = config.filenames.css.replace('[name]', chunk.name);
    var cssPath = path.resolve(dll, css);
    plugins.push(new webpack.DllReferencePlugin({
      context: config.context,
      manifest: require(manifestPath),
    }));
    var assets = [js];
    if (fs.existsSync(cssPath)) {
      assets.push(css);
    }
    plugins.push(new HtmlWebpackIncludeAssetsPlugin({
      assets: assets,
      append: false,
      publicPath: publicPath,
    }));
  });
  return merge(WebpackConfig(config), {
    devtool: 'source-map',
    entry: [
      'webpack-dev-server/client?' + publicUrl,
      'webpack/hot/dev-server',
      config.input.script,
    ],
    output: {
      path: __dirname,
    },
    plugins: [
      new webpack.HotModuleReplacementPlugin(),
      new ExtractTextPlugin({
        disable: true,
      }),
      new HtmlWebpackPlugin({
        inject: true,
        chunksSortMode: 'dependency',
        template: config.input.html,
      }),
    ].concat(plugins),
  });
}

module.exports = WebpackDevConfig;
