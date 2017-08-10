const webpack = require('webpack');
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const WebpackCleanupPlugin = require('webpack-cleanup-plugin');
const merge = require('webpack-merge');

const buildEntryFromEnv = process.env.PACKAGE_DIR;
if (buildEntryFromEnv) {
  console.log(`get package from ${buildEntryFromEnv}`)
}
const config = require(buildEntryFromEnv ? `${buildEntryFromEnv}/package.json` : 'codingIdePlugin/package.json');

const version = process.env.VERSION || config.codingIdePackage.version || config.version;

const defaultConfig = {
  entry: buildEntryFromEnv ? `${buildEntryFromEnv}/src` : './node_modules/codingIdePlugin/src',
  output: {
    path: path.join(__dirname, 'dist', version),
    filename: 'index.js',
  },
  resolve: {
    extensions: ['.js', '.jsx'],
    modules: [
      'src/',
      './node_modules',
    ],
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
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
        screw_ie8: true,
        drop_debugger: true,
      },
    }),
    new ExtractTextPlugin({
      disable: false,
      allChunks: true,
    }),
  ],
  externals: [
    (context, request, callback) => {
      if (request === 'react') request = 'lib/react'
      if (/^app\/.+/.test(request) || /^lib\/.+/.test(request)) {
        const newRequest = request
          .replace(/\//g, '.')
          .replace(/-(.)/g, (__, m) => m.toUpperCase());
        return callback(null, `root ${newRequest}`);
      }
      callback();
    },
  ],
};

let userConfig = {};
try {
  userConfig = require(`${process.env.PLUGIN}/config/webpack.production.config.js`);
} catch (err) {
  console.log('no user config' + err);
}

const protectedProps = [
  'entry',
  'output',
  'resolve',
  'resolveLoader',
];

const merged = merge({
  customizeObject: (a, b, key) => {
    if (protectedProps.includes(key)) return a;
    return undefined;
  }
})(defaultConfig, userConfig);

module.exports = merged;
