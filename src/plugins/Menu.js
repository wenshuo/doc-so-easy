const _ = require('lodash');

function docPath(meta) {
  return {
    path: `/${meta.category.toLowerCase()}/${meta.subcategory.toLowerCase()}/${meta.name.toLowerCase()}.html`,
    name: meta.name
  };
}

module.exports = {
  name: 'menu',
  publish: function(allMetaData) {
    const meta = allMetaData.filter(d => !!d.category);
    let sections = _.groupBy(meta, (d) => d.category.toLowerCase());
    sections = _.reduce(sections, (memo, section, key) => {
      memo[key] = _.groupBy(section, (s) => s.subcategory.toLowerCase());
      return memo;
    }, {});
    return _.map(sections, (section, key) => {
      return {
        name: key,
        items: _.map(section, (category, name) => {
          return {
            name,
            items: category.map(c => docPath(c))
          };
        })
      }
    });
  }
};
