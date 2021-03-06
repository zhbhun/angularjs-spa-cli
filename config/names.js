exports.development = {
  js: '[name].js',
  css: '[name].css',
  media: '[name].[hash:8].[ext]',
  manifest: '[name].manifest.json',
  library: '[name]_library',
  html: '[name].html',
};

exports.production = {
  js: '[name].[chunkhash:8].js',
  css: '[name].[contenthash:8].css',
  media: '[name].[hash:8].[ext]',
  manifest: '[name].manifest.json',
  library: '[name]_library',
  html: '[name].html',
};
