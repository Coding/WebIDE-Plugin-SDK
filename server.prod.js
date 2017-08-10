const express = require('express');

const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const server = require('http').createServer(app);
const mapPackage = require('./.script/mapPackage');

const packagePath = `./dist/${process.env.VERSION}/manifest.json`;
const codingIdePackage = require(packagePath);
const mappedPackage = mapPackage(codingIdePackage);
const PORT = process.env.PORT || 4000;

const corsOptions = {
  origin: 'http://localhost:8060',
  optionsSuccessStatus: 200,
  credentials: true,
};
const codingPackage = mappedPackage.codingIdePackage;


app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use((req, res, next) => {
  if (process.env.VERSION === 'platform') {
    res.set(
    'Content-Type', 'application/vnd.coding.v2+json;charset=UTF-8'
    );
  }
  return next();
});


app.get('/', (req, res) => {
  res.send('it works');
});


app.get('/packages', (req, res) => {
  res.json([{
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
  }]);
});

app.get('/packages/:pkgName/:version/manifest.json', (req, res) => {
  res.json(mappedPackage);
});

app.get('/packages/:pkgName/:version/index.js', (req, res) => {
  res.sendFile(`${__dirname}/dist/${req.params.version}/index.js`);
});

server.listen(PORT, () => {
  console.log(`plugin script folder served at /packages/${codingPackage.name}/${codingPackage.version}`);
  console.log(`plugin list api served at localhost:${PORT}/packages`);
});
