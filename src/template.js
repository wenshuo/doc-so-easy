const fs = require('fs');
const handlebars = require('handlebars');

class Template {
  constructor(config) {
    this.templates = Object.keys(config.templates).reduce((templates, name) => {
      templates[name] = handlebars.compile(fs.readFileSync(config.templates[name].path, 'utf8'));
      return templates;
    }, {});
  }

  getTemplate(name = 'default') {
    return this.templates[name];
  }
}

module.exports = Template;
