const path = require('path');
const appRoot = require('app-root-path');
const SimpleParser = require('./parsers/simple_parser');
const args = require('./args')();
const config = require(path.resolve(appRoot.toString(), args.options.config));
config.watch = args.options.watch;
config.verbose = args.options.verbose;
function defaultFilePath(fileMeta) {
  return `${path.basename(fileMeta.filePath, '.doc.js')}.html`;
}
function defaultUseParser() {
  return SimpleParser;
}
config.useParser = config.useParser || defaultUseParser;
config.outputFilePath = config.outputFilePath || defaultFilePath;

let directoryToWatch;

if (config.watch === 'true') {
  // Watch root directory if watch mode is on but no directory is specified.
  directoryToWatch = appRoot.toString();
} else if (!!config.watch) {
  directoryToWatch = path.resolve(appRoot.toString(), config.watch);
}

config.directoryToWatch = directoryToWatch;
config.baseFileDirectory = directoryToWatch || appRoot.toString();

module.exports = config;
