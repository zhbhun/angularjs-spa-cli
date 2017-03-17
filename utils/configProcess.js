var fs = require('fs');
var path = require('path');

var DEFAULTS = {
  context: fs.realpathSync(process.cwd()),
  input: {
    src: 'src',
    script: 'src/index.js',
    html: 'src/index.html',
  },
  output: {
    dll: '.dll',
    build: 'dist',
    public: '/',
  },
  server: {
    host: 'localhost',
    port: '8080',
  },
};

/**
 * TODO
 *
 * @param {object} config @see DEFAULTS
 */
function configProcess(config) {
  var context = (config && config.context) || DEFAULTS.context;
  var input = Object.assign({}, config && config.input, DEFAULTS.input);
  var output = Object.assign({}, config && config.output, DEFAULTS.output);
  var server = Object.assign({}, config && config.server, DEFAULTS.server);
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
      publicPath: 'http://' + server.host + ':' + server.port + output.public,
    },
  });
};

module.exports = configProcess;
