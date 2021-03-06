var path = require('path');
var webpack = require('webpack');
var autoprefixer = require('autoprefixer');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var ProgressBarPlugin = require('progress-bar-webpack-plugin');
var CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');

var getClientEnvironment = require('./env');
var InterpolateHtmlPlugin = require('../utils/InterpolateHtmlPlugin');

function WebpackConfig(config){
  var env = getClientEnvironment(config.output.publicPath.slice(0, -1));
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
  var cssModuleLoaders = [...cssLoaders];
  cssModuleLoaders[0] = Object.assign({}, cssModuleLoaders[0], {
    options: Object.assign({}, cssModuleLoaders[0].options, {
      localIdentName: production ? '[hash:base64]' : '[local]--[hash:base64:5]',
      modules: true,
    })
  });
  var sassModuleLoaders = [...sassLoaders];
  sassModuleLoaders[0] = Object.assign({}, sassModuleLoaders[0], {
    options: Object.assign({}, sassModuleLoaders[0].options, {
      localIdentName: production ? '[hash:base64]' : '[local]--[hash:base64:5]',
      modules: true,
    })
  });
  return {
    cache: true,
    output: {
      pathinfo: true,
      publicPath: config.output.publicPath,
      filename: config.filenames.js,
      chunkFilename: config.filenames.js,
    },
    resolve: {
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
              publicPath: config.output.publicPath,
              name: config.filenames.media,
            },
          }],
        },
        {
          test: /\.html$/,
          use: [{
            loader: 'html-loader',
            options: Object.assign(
              {
                ignoreCustomFragments: [/\{\{.*?}}/],
                attrs: ['img:src', 'link:href'],
              },
              (config && config.options && config.options['html-loader'] || {})
            ),
          }],
        },
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              cacheDirectory: true,
            },
          },
        },
        {
          test: /\.css$/,
          exclude: /\.module\.css$/,
          use: ExtractTextPlugin.extract({
            fallback: 'style-loader',
            use: cssLoaders,
          }),
        },
        {
          test: /\.module\.css$$/,
          use: ExtractTextPlugin.extract({
            fallback: 'style-loader',
            use: cssModuleLoaders,
          }),
        },
        {
          test: /\.scss$/,
          exclude: /\.module\.scss$/,
          use: ExtractTextPlugin.extract({
            fallback: 'style-loader',
            use: sassLoaders,
          }),
        },
        {
          test: /\.module\.scss$/,
          use: ExtractTextPlugin.extract({
            fallback: 'style-loader',
            use: sassModuleLoaders,
          }),
        },
        {
          test: /\.svg$/,
          use: [{
            loader: 'file-loader',
            options: {
              publicPath: config.output.publicPath,
              name: config.filenames.media,
            },
          }],
        },
      ],
    },
    plugins: [
      // Makes some environment variables available in index.html.
      // The public URL is available as %PUBLIC_URL% in index.html, e.g.:
      // <link rel="shortcut icon" href="%PUBLIC_URL%/favicon.ico">
      // In production, it will be an empty string unless you specify "homepage"
      // in `package.json`, in which case it will be the pathname of that URL.
      new InterpolateHtmlPlugin(env.raw),
      new webpack.BannerPlugin('build: ' + new Date().toString()),
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
  };
}

module.exports = WebpackConfig;
