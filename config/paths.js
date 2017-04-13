var fs = require('fs');

module.exports = {
  context: fs.realpathSync(process.cwd()),
  input: {
    name: 'main',
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
    protocol: 'http',
    host: 'localhost',
    port: '3000',
    proxy: undefined,
  },
};
