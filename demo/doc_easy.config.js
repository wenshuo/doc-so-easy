const path = require('path');

module.exports = {
  files: {
    simple: 'demo/**/*.doc.js'
  },
  template: path.resolve(__dirname, '../template/template.html'),
  assets: {
    js: [
      {
        copy: true,
        path: path.resolve(__dirname, '../template/assets/home.js')
      }
    ],
    css: [
      {
        copy: true,
        path: path.resolve(__dirname, '../template/assets/template.css')
      }
    ]
  },
  outDir: path.resolve(__dirname, '../docs'),
  parsers: {},
  plugins: []
};
