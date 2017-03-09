const package = process.env.PACKAGE || ''

const exec = require('child_process').exec;
if (package) {
exec(`npm install ${package}`);
}
