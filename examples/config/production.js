var path = require('path');

module.exports = {
  context: path.resolve(__dirname, '../'),
  input: {
    src: 'src',
    script: 'src/index.js',
    html: 'src/index.html',
  },
  output: {
    dll: '.dll/production',
    build: 'dist',
    public: '/',
  },
  server: {
    host: 'localhost',
    port: '8080',
  },
  chunks: [{
    name: 'base',
    dependencies: [
      path.resolve(__dirname, '../src/vendor.js'),
    ],
  }],
};
