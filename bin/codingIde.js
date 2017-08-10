#!/usr/bin/env node

const exec = require('child_process').exec;
const path = require('path');
const stepFactory = require('../lib/step');
const parse = require('../lib/parse');

// __dirname, '..?../'
// const targetDir = process.env.PACKAGE_DIR || '../../';

function execPromise(command, options = {}, callback) {
  return new Promise((resolve, reject) => {
    return exec(command, options, function (err, stdout) {
      if (err) { return reject(err); }
      if (callback) {
        callback(stdout);
      }
      return resolve(stdout);
    }
    );
  });
}

async function build() {
  const step = stepFactory();
  let stepNum = 1;
  await step(`[${stepNum++}] get current version`, () => {
    return execPromise('git describe --always --tags')
    .then((stdout) => {
      console.log(`current version is ${stdout}`);
      process.env.VERSION = stdout.replace(/\\n/, '');
      return true;
    });
  });
  await step(`[${stepNum++}] clean up dist folder`, () => {
    return execPromise('node_modules/.bin/rimraf dist/**').then(() => {
      console.log('cleared');
      return true;
    });
  });
  await step(`[${stepNum++}] build source`, () => {
    process.env.PACKAGE_DIR = process.env.PACKAGE_DIR || path.resolve(__dirname, '../../../');
    console.log('current source dir', process.env.PACKAGE_DIR);
    return execPromise('node_modules/.bin/webpack --config node_modules/codingSDK/webpack.production.config.js --progress --profile --colors')
    .then((out) => {
      console.log(out);
      return true;
    })
    .catch((err) => {
      console.log(err);
      return false;
    });
  });
  await step(`[${stepNum++}] generate manifest`, () => {
    try {
      require('../.script/buildManifest');
      return true;
    } catch (err) {
      throw err;
    }
  });
}

const cli = parse(process.argv);


if (cli.args[0] === 'build') {
  build();
}
