var path = require('path');
var webpack = require('webpack');
var merge = require('webpack-merge');
var AssetsPlugin = require('assets-webpack-plugin')
var ExtractTextPlugin = require('extract-text-webpack-plugin');

var WebpackConfig = require('./webpack.config');

function WebpackDevDllConfig(config, index) {
  var chunks = config.chunks;
  var currentChunk = chunks[index];
  var previousChunks = chunks.slice(0, index);
  var outputPath = path.resolve(config.output.dll, currentChunk.name);
  return merge(WebpackConfig(config), {
    devtool: 'source-map',
    entry: {
      [currentChunk.name]: currentChunk.dependencies,
    },
    output: {
      path: outputPath,
      library: config.filenames.library,
    },
    plugins: [
      new ExtractTextPlugin({ filename: config.filenames.css }),
      new webpack.DllPlugin({
        context: config.context,
        name: config.filenames.library,
        path: path.resolve(outputPath, config.filenames.manifest),
      }),
      new AssetsPlugin({
        filename: 'assets.json', // TODO
        fullPath: false,
        includeManifest: false,
        path: outputPath,
        prettyPrint: true,
        update: true,
      }),
    ].concat(previousChunks.map(function (chunk) {
      return new webpack.DllReferencePlugin({
        context: config.context,
        manifest: require(outputPath + '/' + config.filenames.manifest.replace('[name]', chunk.name)),
      });
    })),
  }, config.webpack || {});
}

module.exports = WebpackDevDllConfig;
