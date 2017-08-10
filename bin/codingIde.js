#!/usr/bin/env node

const exec = require('child_process').exec;
const path = require('path');
const stepFactory = require('../lib/step');
const parse = require('../lib/parse');
const generateI18n = require('../.script/generateI18n')

function execPromise(command, options = {}, callback) {
  return new Promise((resolve, reject) => {
    return exec(command, options, function (err, stdout, stderr) {
      if (err) { return reject(err,stdout, stderr); }
      if (callback) {
        callback(stdout);
      }
      return resolve(stdout);
    }
    );
  });
}

async function i18n() {
  process.env.NODE_ENV = 'development';
  const PACKAGE_DIR = process.env.PACKAGE_DIR || path.resolve(__dirname, '../../../');
  process.env.I18nTargetRoot = process.env.I18nTargetRoot || path.resolve(__dirname, '../../../', 'i18n');
  console.log('PACKAGE_DIR', PACKAGE_DIR)
  generateI18n(`${PACKAGE_DIR}/src`)
}

async function serve() {
  const step = stepFactory();
  let stepNum = 1;
  
  await step(`[${stepNum++}] get current version`, () => {
    return execPromise('git describe --always --tags')
    .then((stdout) => {
      console.log(`current version is ${stdout}`);
      process.env.VERSION = stdout.replace(/\s+/, '');
      process.env.PACKAGE_DIR = process.env.PACKAGE_DIR || path.resolve(__dirname, '../../../');    
      return true;
    });
  });
   await step(`[${stepNum++}] start serve from gist`, () => {
    require('../server.prod.js')
  });
}


async function start() {
  process.env.NODE_ENV = 'development';
  process.env.PACKAGE_DIR = process.env.PACKAGE_DIR || path.resolve(__dirname, '../../../');
  require('../server.js')
}
async function build() {
  const step = stepFactory();
  let stepNum = 1;
  await step(`[${stepNum++}] get current version`, () => {
    return execPromise('git describe --always --tags')
    .then((stdout) => {
      console.log(`current version is ${stdout}`);
      process.env.VERSION = stdout.replace(/\s+/, '');
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
    console.log('current source dir', process.env.PACKAGE_DIR, process.env.VERSION);
    return execPromise(`webpack --config ${path.resolve(__dirname, '../', 'webpack.production.config.js')} --progress --profile --colors`)
    .then((out) => {
      console.log(out);
      return true;
    })
    .catch((err, stdout, stderr) => {
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

if (cli.args[0] === 'start') {
  start();
}

if (cli.args[0] === 'i18n') {
  i18n();
}

if (cli.args[0] === 'serve') {
  serve();
}