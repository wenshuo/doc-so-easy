const path = require('path');

class Helper {
  static outputPath(meta) {
    if (!meta.category) {
      return '';
    }
    return path.dirname(Helper.outputFilename(meta));
  }

  static outputFilename(meta) {
    if (!meta.category) {
      return `${meta.name.toLowerCase()}.html`;
    }
    return `${meta.category.toLowerCase()}/${meta.subcategory.toLowerCase()}/${meta.name.toLowerCase()}.html`;
  }
}

module.exports = Helper;
