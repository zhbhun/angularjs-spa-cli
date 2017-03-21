var fs = require('fs');
var path = require('path');

module.exports = {
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
    proxy: undefined,
    nproxy: undefined,
  },
};
