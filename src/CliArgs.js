const argv = require('argv');

argv.option([
  {
    name: 'config',
    short: 'c',
    type: 'string',
    description: 'Defines path to a config file',
    example: "'script --config=path' or 'script -c path'"
  }
]);

module.exports = function getConfig() {
  return argv.run();
};
