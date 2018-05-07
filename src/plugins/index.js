const menuPlugin = require('./Menu');
const defaultPlugins = [menuPlugin];

class PluginProcessor {
  constructor(plugins = []) {
    const allPlugins = defaultPlugins.concat(plugins);
    this.transformPlugins = allPlugins.filter(p => !!p.transform);
    this.publishPlugins = allPlugins.filter(p => !!p.publish);
  }

  transform(metaData) {
    if (this.transformPlugins.length) {
      this.transformPlugins.forEach(plugin => plugin.transform(metaData));
    }

    return metaData;
  }

  publish(allMetaData) {
    if (this.publishPlugins.length) {
      return this.publishPlugins.reduce((memo, plugin) => {
        memo[plugin.name] = plugin.publish(allMetaData);
        return memo;
      }, {});
    }
  }
}

module.exports = PluginProcessor;
