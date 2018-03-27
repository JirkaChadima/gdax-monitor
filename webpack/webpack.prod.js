const webpack = require('webpack');
const merge = require('webpack-merge');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const webpackConfig = require('./webpack.config');

module.exports = merge(webpackConfig, {
  devtool: "source-map",
  output: {
    path: __dirname + "/../docs/",
    publicPath: "/gdax-monitor/",
    filename: "[name]-[hash].min.js",
  },
  optimization: {
    splitChunks: {
      chunks: "all",
      name: true,
    },
  },
  plugins: [
    new CopyWebpackPlugin([
      {from: './_config.yml', to: '_config.yml'}
    ]),
  ],
});