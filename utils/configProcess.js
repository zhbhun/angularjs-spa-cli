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
  var context = (config && config.context) || paths.context;
  var input = Object.assign({}, paths.input, config && config.input);
  var output = Object.assign({}, paths.output, config && config.output);
  var server = Object.assign({}, paths.server, config && config.server);
  var filenames = Object.assign({}, names[process.env.NODE_ENV], config && config.names);
  var realServer = (server.protocol ? (server.protocol + '://') : '//')
    + server.host
    + (server.port ? (':' + server.port) : '');

  var filenameFrefix = filenames.prefix;
  if (mode === 'dll') {
    if (filenames.dllPrefix === undefined) {
      filenameFrefix = filenames.prefix;
    } else {
      filenameFrefix = filenames.dllPrefix;
    }
  }
  return Object.assign({}, config, {
    context: context,
    input: {
      src: path.resolve(context, input.src),
      script: path.resolve(context, input.script),
      html: path.resolve(context, input.html),
    },
    output: {
      dll: path.resolve(context, output.dll),
      build: path.resolve(context, output.build),
      public: output.public, // absolute path
      publicUrl: realServer + '/', // server url
      publicPath: realServer + output.public, // server url + absolute path
    },
    server: server,
    filenames: Object.keys(filenames).reduce(function (fns, key) {
      if (key != 'prefix' && key != 'dllPrefix') {
        if (key === 'library') {
          fns[key] = filenames[key];
        } else {
          fns[key] = filenameFrefix + filenames[key];
        }
      }
      return fns;
    }, {}),
  });
}

module.exports = configProcess;
