/*

nodemon is a utility for node, and replaces the use of the executable
node. So the user calls `nodemon foo.js` instead.

nodemon can be run in a number of ways:

`nodemon` - tries to use package.json#main property to run
`nodemon` - if no package, looks for index.js
`nodemon app.js` - runs app.js
`nodemon --arg app.js --apparg` - eats arg1, and runs app.js with apparg
`nodemon --apparg` - as above, but passes apparg to package.json#main (or
  index.js)
`nodemon --debug app.js

*/

const fs = require('fs');
const path = require('path');
const existsSync = fs.existsSync || path.existsSync;

module.exports = parse;

/**
 *
 * @param  {Array} full process arguments, including `node` leading arg
 * @return {Object} { options, script, args }
 */
function parse(argv) {
  if (typeof argv === 'string') {
    argv = argv.split(' ');
  }

  const eat = function (i, args) {
    if (i <= args.length) {
      return args.splice(i + 1, 1).pop();
    }
  };

  const args = argv.slice(2);
  let script = null;
  const options = { scriptPosition: null };

  const codingOpt = codingIdeOption.bind(null, options);
  let lookForArgs = true;

  // move forward through the arguments
  for (let i = 0; i < args.length; i++) {
    // if the argument looks like a file, then stop eating
    if (!script) {
      if (args[i] === '.' || existsSync(args[i])) {
        script = args.splice(i, 1).pop();

        // we capture the position of the script because we'll reinsert it in
        // the right place in run.js:command (though I'm not sure we should even
        options.scriptPosition = i;
        i--;
        continue;
      }
    }

    if (lookForArgs) {
      // respect the standard way of saying: hereafter belongs to my script
      if (args[i] === '--') {
        args.splice(i, 1);
        // cycle back one argument, as we just ate this one up
        i--;

        // ignore all further nodemon arguments
        lookForArgs = false;

        // move to the next iteration
        continue;
      }

      if (codingOpt(args[i], eat.bind(null, i, args)) !== false) {
        args.splice(i, 1);
        // cycle back one argument, as we just ate this one up
        i--;
      }
    }
  }

  options.script = script;
  options.args = args;

  return options;
}


/**
 * Given an argument (ie. from process.argv), sets nodemon
 * options and can eat up the argument value
 *
 * @param {Object} options object that will be updated
 * @param {Sting} current argument from argv
 * @param {Function} the callback to eat up the next argument in argv
 * @return {Boolean} false if argument was not a nodemon arg
 */
function codingIdeOption(options, arg, eatNext) {
  // line seperation on purpose to help legibility
  if (arg === '--help' || arg === '-h' || arg === '-?') {
    const help = eatNext();
    options.help = help || true;
  } else

  if (arg === '--version' || arg === '-v') {
    options.version = true;
  } else

  if (arg === '--dump') {
    options.dump = true;
  } else

  if (arg === '--verbose' || arg === '-V') {
    options.verbose = true;
  } else

  // Depricated as this is "on" by default
  if (arg === '--js') {
    options.js = true;
  } else

  if (arg === '--quiet' || arg === '-q') {
    options.quiet = true;
  } else

  if (arg === '--hidden') { // TODO document this flag?
    options.hidden = true;
  } else

  if (arg === '--config') {
    options.configFile = eatNext();
  } else

  if (arg === '--cwd') {
    options.cwd = eatNext();

    // go ahead and change directory. This is primarily for nodemon tools like
    // grunt-nodemon - we're doing this early because it will affect where the
    // user script is searched for.
    process.chdir(path.resolve(options.cwd));
  } else {
    // this means we didn't match
    return false;
  }
}
