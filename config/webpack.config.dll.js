var path = require('path');
var merge = require('webpack-merge');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

var names = require('./names').dll;
var WebpackConfig = require('./webpack.config');

function WebpackDevDllConfig(config, index) {
  var chunks = config.chunks;
  var currentChunk = chunks[index];
  var previousChunks = chunks.slice(0, index);
  return merge(WebpackConfig(config), {
    devtool: 'source-map',
    entry: {
      [currentChunk.name]: currentChunk.dependencies,
    },
    output: {
      path: config.output.dll,
      filename: names.js,
      chunkFilename: names.js,
      library: names.library,
    },
    plugins: [
      new ExtractTextPlugin({ filename: names.css }),
      new webpack.DllPlugin({
        context: config.context,
        name: names.library,
        path: path.resolve(config.output.dll, names.manifest),
      }),
    ].concat(previousChunks.map(function (chunk) {
      return new webpack.DllReferencePlugin({
        context: config.context,
        manifest: require(config.output.dll + '/' + names.manifest.replace('[name]', chunk.name)),
      });
    })),
  });
}

module.exports = WebpackDevDllConfig;
