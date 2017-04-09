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
 */
function configProcess(config) {
  var context = (config && config.context) || paths.context;
  var input = Object.assign({}, paths.input, config && config.input);
  var output = Object.assign({}, paths.output, config && config.output);
  var server = Object.assign({}, paths.server, config && config.server);
  var filenames = Object.assign({}, names[process.env.NODE_ENV], config && config.names);
  var realServer = (server.protocol ? (server.protocol + '://') : '//')
    + server.host
    + (server.port ? (':' + server.port) : '');
  return Object.assign(config, {
    context: context,
    input: {
      src: path.resolve(context, input.src),
      script: path.resolve(context, input.script),
      html: path.resolve(context, input.html),
    },
    output: {
      dll: path.resolve(context, output.dll),
      build: path.resolve(context, output.build),
      publicUrl: realServer + '/',
      publicPath: (server.proxy ? server.proxy : realServer) + output.public,
    },
    server: server,
    filenames: filenames,
  });
}

module.exports = configProcess;
