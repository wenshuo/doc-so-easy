// TODO add support for data type

const fs = require('fs');
const path = require('path');
const extract = require('extract-comments');
const Stack = require('../stack');

function tagText(line) {
  const matched = line.match(/(\s*)@(\w+)\s+(.*)/);

  return matched ? matched[3] : '';
}

function tagDescription(lines, i) {
  if (i >= lines.length) {
    return '';
  }

  let text = '';
  let lineNumber = i;

  while(lineNumber < lines.length && !/\s*@(\w+)/.test(lines[lineNumber])) {
    const trimedText = lines[lineNumber].trimLeft().replace(/^(\*\/)|(\/\/)|(\*)/, '');
    text = `${text}${trimedText}\n`;
    lineNumber += 1;
  }

  return {
    lineNumber,
    text: text.trimRight()
  };
}

function extractTags(lines) {
  let lineNumber = 0;
  const tags = [];

  while (lineNumber < lines.length) {
    const matched = lines[lineNumber].match(/(\s*)@(\w+)/);
    if (matched) {
      const tag = {
        name: matched[2],
        value: tagText(lines[lineNumber]),
        position: matched[1].length,
        lineNumber,
        children: []
      };
      if (/^\s*$/.test(tag.value)) {
        const meta = tagDescription(lines, lineNumber + 1);
        lineNumber = meta.lineNumber;
        tag.value = meta.text;
      } else {
        lineNumber += 1;
      }
      tags.push(tag);
    } else {
      lineNumber += 1;
    }
  }

  return tags;
}

function addChild(parents, tag) {
  const parent = parents.last();
  if (parent) {
    parent.children.push(tag);
  }
}

function buildTagTree(tags) {
  const parents = new Stack();
  const tree = [];
  if (tags.length === 0) {
    return tree;
  }

  if (tags[0].children.length === 0) {
    tree.push(tags[0]);
  }

  for (let i = 1; i < tags.length; i += 1) {
    const previousTag = tags[i - 1];
    const tag = tags[i];

    if (tag.position < previousTag.position) {
      parents.pop();
    } else if (tag.position > previousTag.position) {
      parents.add(previousTag);
    }
    const parent = parents.last();
    if (parent) {
      parent.children.push(tag);
    } else {
      tree.push(tag);
    }
  }

  return tree;
}

function toObject(tags, obj = {}) {
  return tags.reduce((memo, tag) => {
    const key = tag.name;

    if (!memo[key]) {
      if (tag.children.length) {
        memo[key] = {};
        toObject(tag.children, memo[key]);
      } else {
        memo[key] = tag.value;
      }
    } else {
      if (!Array.isArray(memo[key])) {
        memo[key] = [memo[key]];
      }
      const content = {};
      memo[key].push(content);
      toObject(tag.children, content);
    }

    return memo;
  }, obj);
}

module.exports = {
  name: 'comment',
  execute(file) {
    let allTags = [];
    const comments = extract(fs.readFileSync(file, 'utf8'));

    for (const comment of comments) {
      const lines = comment.value.split('\n');

      if (lines.length) {
        allTags = allTags.concat(buildTagTree(extractTags(lines)));
      }
    }
    if (allTags.length) {
      return toObject(allTags);
    }
  }
};
