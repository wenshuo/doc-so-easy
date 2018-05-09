module.exports = {
  name: 'simple',
  execute(file) {
    delete require.cache[file];
    return require(file);
  }
};
