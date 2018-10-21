const webpack = require('webpack');
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const WebpackCleanupPlugin = require('webpack-cleanup-plugin');
const merge = require('webpack-merge');
const WebpackBar = require('webpackbar');

const { generalExtenalAlias } = require('./utils/createExternalAlias');

const webpackProgressPlugin = require('./webpack.progress.plugin');

const defaultConfig = {
  entry: './src',
  output: {
    path: path.join(__dirname, 'dist', ''),
    filename: 'index.js',
  },
  resolve: {
    extensions: ['*', '.js', '.jsx'],
    modules: [
      'src/',
      'node_modules',
    ],
    alias: {
      home: path.join(process.env.PACKAGE_DIR, 'src'),
    },
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
      __DEV__: true,
    }),
    new ExtractTextPlugin({
      disable: false,
      allChunks: true,
    }),
    webpackProgressPlugin,
    new WebpackBar({
      name: 'cloudstudio-plugin-sdk',
      done: () => {
        console.log('Build Success.');
      }
    }),
  ],
  externals: [
    (context, request, callback) => {
      if (/^app\/.+/.test(request) || /^lib\/.+/.test(request)) {
        const newRequest = request
          .replace(/\//g, '.')
          .replace(/-(.)/g, (__, m) => m.toUpperCase());
        return callback(null, `root ${newRequest}`);
      }
      callback();
    },
    generalExtenalAlias,
    'cloudstudio',
  ],

};

let userConfig = {};
try {
  userConfig = require(`${process.env.PACKAGE_DIR}/config/webpack.dev.config.js`);
} catch (err) {
  console.log(err);
}

const protectedProps = [
  'entry',
  'output',
  // 'resolve',
  'resolveLoader',
];

const merged = merge({
  customizeObject: (a, b, key) => {
    if (protectedProps.includes(key)) return a;
    return undefined;
  },
})(defaultConfig, userConfig);

module.exports = merged;
