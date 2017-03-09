const webpack = require('webpack');
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const WebpackCleanupPlugin = require('webpack-cleanup-plugin');

// const srcRoot = 
const name = require('./package.json').codingIdePackage.name;
console.log('name');

module.exports = {
  entry: './src',
  output: {
    path: path.join(__dirname, 'dist', ''),
    filename: `${name}.js`,
  },
  resolve: {
    extensions: ['*', '.js', '.jsx'],
    modules: [
      'src/',
      'node_modules',
    ],
  },
  resolveLoader: {
    modules: [path.resolve(__dirname, 'loaders／'), 'node_modules'],
  },
  module: {
    rules: [
      { test: /\.jsx?$/, use: ['babel-loader'] },
      { test: /\.styl$/,
        use: [
          'style-loader',
          'css-loader',
          'stylus-loader',
        ],
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  plugins: [
    new WebpackCleanupPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"',
      },
    }),
    new ExtractTextPlugin({
      disable: false,
      allChunks: true,
    }),
  ],
};

