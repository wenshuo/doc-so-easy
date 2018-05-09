const argv = require('argv');

argv.option([
  {
    name: 'config',
    short: 'c',
    type: 'string',
    description: 'Defines path to a config file',
    example: "'script --config=path' or 'script -c path'"
  },
  {
    name: 'watch',
    short: 'w',
    type: 'string',
    description: 'watch mode',
    example: "'script --watch directory' or 'script -w directory'"
  },
  {
    name: 'verbose',
    short: 'v',
    type: 'boolean',
    description: 'show debug information',
    example: "'script --verbose' or 'script -v'"
  }
]);

module.exports = function getConfig() {
  return argv.run();
};
