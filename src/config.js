const path = require('path');
const appRoot = require('app-root-path');
const args = require('./args')();
const config = require(path.resolve(appRoot.toString(), args.options.config));
config.watch = args.options.watch;
config.verbose = args.options.verbose;

function defaultFilePath(fileMeta) {
  return `${path.basename(fileMeta.filePath, '.doc.js')}.html`;
}

config.outputFilePath = config.outputFilePath || defaultFilePath;
module.exports = config;
