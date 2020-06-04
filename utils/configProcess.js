var path = require('path');

var paths = require('../config/paths');
var names = require('../config/names');

/**
 * TODO
 *
 * @param {object} config
 * @param {string} config.context
 * @param {object} config.input
 * @param {string} config.input.src
 * @param {string} config.input.script
 * @param {string} config.input.html
 * @param {object} config.output
 * @param {string} config.output.dll
 * @param {string} config.output.build
 * @param {string} config.output.public
 * @param {object} config.server
 * @param {string} config.server.host
 * @param {string} config.server.port
 * @param {string} config.server.proxy
 * @param {object} config.names
 * @param {string} config.names.js
 * @param {string} config.names.css
 * @param {string} config.names.media
 * @param {string} config.names.manifest
 * @param {string} config.names.library
 * @param {string} mode development|production|dll
 */
function configProcess(config, mode) {
  // extract config
  var context = (config && config.context) || paths.context;
  var input = config && config.input;
  var output = Object.assign({}, paths.output, config && config.output);
  var server;
  if (config && config.server === false) {
    server = false;
  } else {
    server = Object.assign({}, paths.server, config && config.server);
  }
  var defaultFilenames = names[process.env.NODE_ENV];
  var filenames = Object.assign({}, defaultFilenames, config && config.filenames);
  var chunks = config.chunks;
  // input transform as array
  if (!Array.isArray(input)) {
    input = [Object.assign({}, paths.input, input)];
  } else {
    input = input.map(function (item) {
      return Object.assign({}, paths.input, item);
    });
  }
  // server address
  var realServer = '';
  if (server) {
    realServer = (server.protocol ? (server.protocol + '://') : '//')
    + server.host
    + (server.port ? (':' + server.port) : '');
  }
  // resolve default chunks
  if (chunks === undefined || typeof chunks === 'string') {
    chunks = [{
      name: chunks || 'dev',
      dependencies: Object.keys(require(path.resolve(context, 'package.json')).dependencies),
    }];
  } else if (chunks === false || !Array.isArray(chunks)) {
    chunks = [];
  }
  return Object.assign({}, config, {
    context: context,
    input: input.map(function (i) {
      return {
        name: i.name,
        src: path.resolve(context, i.src),
        script: path.resolve(context, i.script),
        html: path.resolve(context, i.html),
      };
    }),
    output: {
      dll: path.resolve(context, output.dll),
      build: path.resolve(context, output.build),
      public: output.public, // absolute path
      publicUrl: realServer + '/', // server url
      publicPath: realServer + output.public, // server url + absolute path
    },
    server: server,
    filenames: Object.keys(filenames).reduce(function (names, key) {
      names[key] = filenames[key].replace('[default]', defaultFilenames[key]);
      return names;
    }, {}),
    chunks,
    options: config.options,
  });
}

module.exports = configProcess;
