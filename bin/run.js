#!/usr/bin/env node

const path = require('path');
const fs = require('fs-extra');
const appRoot = require('app-root-path');
const args = require('../src/CliArgs')();
const glob = require('glob');
const config = require(path.resolve(appRoot.toString(), args.options.config));
const filePattern = config.files;
const defaultParsers = require('../src/parsers');
const Template = require('../src/Template');
const Transformer = require('../src/Transformer');
const PluginProcessor = require('../src/Plugins');
const Helper = require('../src/Helper');
const pluginProcessor = new PluginProcessor(config.plugins);
const parsers = Object.assign({}, defaultParsers, config.parsers || {});
const template = new Template(config.template);
const parsedFiles = Object.keys(filePattern).reduce((memo, key) => {
  const files = glob.sync(filePattern[key]);
  const Parser = parsers[key];
  if (!Parser) {
    throw new Error(`We don't find this parser: ${key}`);
  }
  memo = memo.concat(files.map(f => {
    const parsedFile = Parser.execute(path.resolve(appRoot.toString(), f));
    return pluginProcessor.transform(parsedFile);
  }));
  return memo;
}, []);

const pluginData = pluginProcessor.publish(parsedFiles);
// process assets
fs.ensureDirSync(`${appRoot}/${config.outDir}/assets`);

const templateAssets = Object.keys(config.assets).reduce((memo, type) => {
  memo[type] = config.assets[type].map((asset) => {
    if (asset.copy) {
      try {
        fs.copySync(asset.path, `${config.outDir}/assets/${path.basename(asset.path)}`);
      } catch (e) {
        console.log(e);
      }
    }
    return {
      path: asset.copy ? `/assets/${path.basename(asset.path)}`: asset.path
    };
  });
  return memo;
}, {});

const docs = parsedFiles.map((file) => {
  if (pluginData) {
    file.plugged = pluginData;
  }
  file.jsAssets = templateAssets.js;
  file.cssAssets = templateAssets.css;
  const doc = Transformer.transform(template.docTemplate, file);
  const outputPath = Helper.outputPath(file);
  const outputFilename = Helper.outputFilename(file);
  fs.ensureDirSync(path.resolve(config.outDir, outputPath));
  fs.writeFileSync(path.resolve(config.outDir, outputFilename), doc, 'utf8');
});
