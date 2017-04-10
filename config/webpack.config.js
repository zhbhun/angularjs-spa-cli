var path = require('path');
var webpack = require('webpack');
var merge = require('webpack-merge');
var autoprefixer = require('autoprefixer');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var ProgressBarPlugin = require('progress-bar-webpack-plugin');
var CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');

var getClientEnvironment = require('./env');

function WebpackConfig(config){
  var env = getClientEnvironment(config.output.publicPath);
  var production = env.raw.NODE_ENV === 'production';
  var cssLoaders = [
    {
      loader: 'css-loader',
      options: {
        importLoaders: 1,
        minimize: production,
        sourceMap: !production,
      }
    }, {
      loader: 'postcss-loader',
      options: {
        ident: 'postcss', // https://webpack.js.org/guides/migrating/#complex-options
        plugins: function () {
          return [
            // stylelint(),
            autoprefixer({
              browsers: [
                '>1%',
                'last 4 versions',
                'Firefox ESR',
                'not ie < 9', // doesn't support IE8 anyway
              ]
            })
          ]
        }
      }
    }
  ];
  var sassLoaders = cssLoaders.concat('sass-loader');
  return merge({
    cache: true,
    output: {
      pathinfo: true,
      publicPath: config.output.publicPath,
      filename: config.filenames.js,
      chunkFilename: config.filenames.js,
    },
    resolve: {
      alias: {
        '~': config.input.src,
      },
      extensions: ['.js'],
      modules: [
        path.resolve(config.context, 'node_modules'),
      ],
    },
    module: {
      rules: [
        {
          enforce: 'pre',
          test: /\.js$/,
          exclude: /node_modules/,
          use: 'eslint-loader',
        },
        {
          exclude: [
            /\.html$/,
            /\.js$/,
            /\.css$/,
            /\.scss$/,
            /\.json$/,
            /\.svg$/
          ],
          use: [{
            loader: 'url-loader',
            options: {
              limit: 10000,
              name: '[name]-[hash].[ext]',
            },
          }],
        },
        {
          test: /\.html$/,
          use: [{
            loader: 'html-loader',
            options: {
              ignoreCustomFragments: [/\{\{.*?}}/],
              attrs: ['img:src', 'link:href'],
            },
          }],
        },
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: 'babel-loader',
        },
        {
          test: /\.css$/,
          use: ExtractTextPlugin.extract({
            fallback: 'style-loader',
            use: cssLoaders,
          }),
        },
        {
          test: /\.scss$/,
          use: ExtractTextPlugin.extract({
            fallback: 'style-loader',
            use: sassLoaders,
          }),
        },
        {
          test: /\.svg$/,
          use: [{
            loader: 'file-loader',
            options: {
              name: '[name]-[hash].[ext]',
            },
          }],
        },
      ],
    },
    plugins: [
      new ProgressBarPlugin(),
      new webpack.DefinePlugin(env.stringified),
      new CaseSensitivePathsPlugin(),
      new webpack.NoEmitOnErrorsPlugin(),
    ].concat(production ? [
      new webpack.optimize.UglifyJsPlugin({
        beautify: false,
        comments: false,
        compress: {
          screw_ie8: true, // doesn't support IE8
          warnings: false,
          drop_console: true,
          collapse_vars: true,
          reduce_vars: true,
        },
        mangle: {
          screw_ie8: true,
        },
        output: {
          comments: false,
          screw_ie8: true,
        },
      }),
    ]: []),
    node: {
      fs: 'empty',
      net: 'empty',
      tls: 'empty'
    },
  }, config.webpack || {});
}

module.exports = WebpackConfig;
