const path = require('path');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');
const webpack = require('webpack');

module.exports = {
  entry: {
    vendor: ['jquery'],
    index: './public/javascripts/index.js',
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'public'),
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      filename: 'vendor.js',
      minChunks: 2,
    }),
  ],

  // watch: true,
  // plugins: [
  //   new BrowserSyncPlugin({
  //     host: 'localhost',
  //     port: 8080,
  //     files: ['./views/placeholders/*.pug', './views/*.pug'],
  //     proxy: 'http://localhost:8090/',
  // server: {
  //   baseDir: ['public/*.html', 'views/*/*.pug']
  // }
  //   }),
  // ],
};
