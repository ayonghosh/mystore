var webpack = require('webpack');

module.exports = {
  entry: './client/scripts/app.js',
  output: {
    path: './client/js',
    filename: 'app.bundle.js'
  },
  resolve: {
    modulesDirectories: ['node_modules'],
  }
};