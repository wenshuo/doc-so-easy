const fs = require('fs');
const path = require('path');
const defaultTemplate = path.resolve(__dirname, './template.html');
const handlebars = require('handlebars');

class Template {
  constructor(templatePath = defaultTemplate) {
    const template = fs.readFileSync(templatePath, 'utf8');
    this.template = handlebars.compile(template);
  }

  get docTemplate() {
    return this.template;
  }
}

module.exports = Template;
