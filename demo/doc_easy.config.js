const path = require('path');
const MenuPlugin = require('../src/plugins/menu');

module.exports = {
  files: ['**/*.doc.js'],
  templates: {
    'default': {
      path: path.resolve(__dirname, './template/default.html'),
      assets: {
        css: [
          {
            copy: true,
            path: path.resolve(__dirname, './template/assets/template.css')
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
  plugins: [MenuPlugin]
};
