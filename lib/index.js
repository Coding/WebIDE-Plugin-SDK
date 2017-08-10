const parse = require('./parse');

/**
 * Converts a string to command line args, in particular
 */
function stringToArgs(string) {
  const args = [];

  const parts = string.split(' ');
  const length = parts.length;
  let i = 0;
  let open = false;
  let grouped = '';
  let lead = '';

  for (; i < length; i++) {
    lead = parts[i].substring(0, 1);
    if (lead === '"' || lead === '\'') {
      open = lead;
      grouped = parts[i].substring(1);
    } else if (open && parts[i].slice(-1) === open) {
      open = false;
      grouped += ` ${parts[i].slice(0, -1)}`;
      args.push(grouped);
    } else if (open) {
      grouped += ` ${parts[i]}`;
    } else {
      args.push(parts[i]);
    }
  }

  return args;
}

module.exports = {
  parse(argv) {
    if (typeof argv === 'string') {
      argv = stringToArgs(argv);
    }
    return parse(argv);
  },
};
