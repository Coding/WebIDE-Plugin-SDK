console.log("start generate manifest")
const fs = require('fs');
const packageConfig = require('codingIdePlugin/package.json');
const mapPackage = require('./mapPackage');

const version = packageConfig.codingIdePackage.version || packageConfig.version
const newPackage = mapPackage(packageConfig)
fs.writeFile(`dist/${version}/manifest.json`, JSON.stringify(newPackage, null, 4), 
function(err) {
    if(err) {
        return console.log(err);
    }
    console.log("generate manifest json success");
});
