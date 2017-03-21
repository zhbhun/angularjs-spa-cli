var path = require('path');

module.exports = {
  context: path.resolve(__dirname, '../'),
  input: {
    src: 'src',
    script: 'src/index.js',
    html: 'src/index.html',
  },
  output: {
    dll: '.dll/nproxy',
    build: 'dist',
    public: '/static/',
  },
  server: {
    host: 'localhost',
    port: '8080',
    nproxy: path.resolve(__dirname, './rules.js'),
  },
  chunks: [{
    name: 'dev',
    dependencies: [
      path.resolve(__dirname, '../src/vendor.js'),
    ],
  }],
};
