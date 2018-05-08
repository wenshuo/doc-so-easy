const path = require('path');
const appRoot = require('app-root-path');
const args = require('./args')();
const config = require(path.resolve(appRoot.toString(), args.options.config));
config.watch = args.options.watch;
config.verbose = args.options.verbose;
config.templates = Object.assign({
  'default': {
    path: path.resolve(__dirname, '../template/template.html'),
    assets: {
      css: [
        {
          copy: true,
          path: path.resolve(__dirname, '../template/assets/template.css')
        }
      ]
    }
  }
}, config.templates || {});
module.exports = config;
