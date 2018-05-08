class SimpleParser {
  static execute(file) {
    delete require.cache[file];
    return require(file);
  }
}

module.exports = SimpleParser;
