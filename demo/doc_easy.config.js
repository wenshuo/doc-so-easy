const path = require('path');
const MenuPlugin = require('../src/plugins/menu');
const ExamplePlugin = require('./example_plugin');

module.exports = {
  files: ['source/*.@(jsx|scss)'],
  templates: {
    'default': {
      path: path.resolve(__dirname, './template/default.html'),
      assets: {
        js: [
          {
            copy: true,
            path: path.resolve(__dirname, '../node_modules/react/umd/react.production.min.js')
          },
          {
            copy: true,
            path: path.resolve(__dirname, '../node_modules/react-dom/umd/react-dom.production.min.js')
          },
          {
            path: 'http://localhost:8080/app.js'
          }
        ],
        css: [
          {
            copy: true,
            path: path.resolve(__dirname, './template/assets/template.css')
          },
          {
            path: 'http://localhost:8080/index.css'
          }
        ]
      }
    },
    index: {
      path: path.resolve(__dirname, './template/index.html'),
      assets: {
        js: [
          {
            copy: true,
            path: path.resolve(__dirname, './template/assets/link_toggle.js')
          },
          {
            copy: true,
            path: path.resolve(__dirname, './template/assets/reload.js')
          }
        ],
        css: [
          {
            copy: true,
            path: path.resolve(__dirname, './template/assets/template.css')
          }
        ]
      }
    }
  },
  outDir: path.resolve(__dirname, '../public'),
  outputFilePath(meta) {
    if (!meta.category) {
      return meta.name ? `${meta.name.toLowerCase()}.html` : '';
    }
    return `${meta.category.toLowerCase()}/${meta.subcategory.toLowerCase()}/${meta.name.toLowerCase()}.html`;
  },
  plugins: [MenuPlugin, ExamplePlugin]
};
