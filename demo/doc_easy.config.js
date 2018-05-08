const path = require('path');

module.exports = {
  files: ['demo/**/*.doc.js'],
  templates: {
    index: {
      path: path.resolve(__dirname, '../template/index.html'),
      assets: {
        js: [
          {
            copy: true,
            path: path.resolve(__dirname, '../template/assets/link_toggle.js')
          },
          {
            copy: true,
            path: path.resolve(__dirname, '../template/assets/reload.js')
          }
        ],
        css: [
          {
            copy: true,
            path: path.resolve(__dirname, '../template/assets/template.css')
          }
        ]
      }
    }
  },
  outDir: path.resolve(__dirname, '../public'),
  parsers: {},
  plugins: []
};
