const Handlebars = require('handlebars');

class Transformer {
  static transform(template, metaData) {
    return template(metaData);
  }
}

module.exports = Transformer;
