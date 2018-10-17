const express = require('express');

const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const http = require('http');
const log4js = require('log4js');

const webpackConfig = require('./webpack.dev.config');
const compiler = require('webpack')(webpackConfig);
const mapPackage = require('./.script/mapPackage');

const server = http.createServer(app);
const io = require('socket.io').listen(server);
const webpackProgressPlugin = require('./webpack.progress.plugin');

const packagePath = `${process.env.PACKAGE_DIR}/package.json` || '../../package.json';

const codingIdePackage = require(packagePath);

const mappedPackage = mapPackage(codingIdePackage);
const codingPackage = mappedPackage.codingIdePackage;

const PORT = process.env.PORT || 65000;

const logger = log4js.getLogger('dev-server');
logger.level = 'debug';

const corsOptions = {
  origin: ['http://localhost:8060', 'http://ide.test:8060'],
  optionsSuccessStatus: 200,
  credentials: true,
};

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use((req, res, next) => {
  if (process.env.VERSION === 'platform') {
    res.set('Content-Type', 'application/vnd.coding.v2+json;charset=UTF-8');
  }
  return next();
});

app.get('/', (req, res) => {
  res.send('it works');
});

app.get('/packages', (req, res) => {
  res.json([
    {
      author: codingPackage.author || '',
      description: codingPackage.description,
      displayName: codingPackage.displayName,
      enabled: true,
      id: 0,
      name: codingPackage.name,
      requirement: 'Required',
      status: 'Available',
      version: codingPackage.version,
      loadType: codingPackage.loadType,
    },
  ]);
});

app.get('/packages/:pkgName/:version/manifest.json', (req, res) => {
  res.json(mappedPackage);
});

const webpackDevInstance = require('webpack-dev-middleware')(compiler, {
  publicPath: `/packages/${codingPackage.name}/${codingPackage.version}`,
  headers: { 'Access-Control-Allow-Origin': 'http://ide.test:8060' },
  historyApiFallback: true,
  quiet: false,
  noInfo: false,
  inline: true,
  stats: {
    color: true,
    assets: false,
    colors: true,
    version: false,
    hash: false,
    timings: true,
    chunks: true,
    chunkModules: false,
  },
});

app.use(webpackDevInstance);

io.on('connection', (socket) => {
  webpackProgressPlugin.setSocket(socket);

  let initialize = false;
  readfile().then((script) => {
    socket.emit('hmrfile', { codingPackage, script });
    compiler.watch({}, (err) => {
      if (!err) {
        initialize = true;
        logger.info('send reload command to frontend');
        io.emit('change', mappedPackage);
      }
    });
  });

  logger.info(`hotreload socket server started ,connected id ${socket.id}`);
  socket.on('change', () => {
    socket.broadcast.emit('onchange');
  });

  socket.on('readfile', () => {
    if (initialize) {
      readfile().then(script => socket.emit('hmrfile', { codingPackage, script }));
    }
  });
});

function readfile() {
  return new Promise((resolve, reject) => {
    http.get(
      `http://127.0.0.1:65000/packages/${codingPackage.name}/${codingPackage.version}/index.js`,
      (res) => {
        let script = '';
        res.on('data', (data) => {
          script += data;
        });
        res.on('end', () => {
          resolve(script);
        });
      }
    );
  });
}

server.listen(PORT, () => {
  logger.info(
    `plugin script folder served at /packages/${codingPackage.name}/${codingPackage.version}`
  );
  logger.info(`plugin list api served at localhost:${PORT}/packages`);
});

module.exports = { emitChange: io.emit };
