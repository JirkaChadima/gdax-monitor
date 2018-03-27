const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const packageFile = require('../package');

var GIT_REV = process.env.GIT_REV || 'unknown';
var VERSION_NUMBER = packageFile.version || '0.0.0';

module.exports = {
  context: path.join(__dirname, "../src"),
  devtool: "cheap-module-source-map",
  entry: {
    index: "./index.js",
  },
  devServer: {
    historyApiFallback: true,
    contentBase: path.join(__dirname, "src"),
    compress: true,
    port: 8080
  },
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.esm.js'
    }
  },
  module: {
    rules: [
      {
        test: /\.png$/,
        loader: "url-loader",
        query: { mimetype: "image/png" }
      },
      {
        test: /\.css$/,
        loaders: ['style-loader','raw-loader']
      },
      {
        test: /\.svg$/,
        loader: "url-loader"
      },
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'index.html',
      filename: 'index.html',
      inject: true,
    }),
    new CopyWebpackPlugin([
      {from: './assets', to: 'assets'}
    ]),
    new webpack.DefinePlugin({
      'GIT_REV': JSON.stringify(GIT_REV),
      'VERSION_NUMBER': JSON.stringify(VERSION_NUMBER),
    })
  ]
};
