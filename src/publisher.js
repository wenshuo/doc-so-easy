const path = require('path');
const fs = require('fs-extra');
const appRoot = require('app-root-path');
const glob = require('glob');
const _ = require('lodash');
const defaultParsers = require('../src/parsers');
const Template = require('../src/template');
const Transformer = require('../src/transformer');
const PluginProcessor = require('../src/Plugins');

class Publisher {
  constructor(config) {
    this.config = config;
    this.pluginProcessor = new PluginProcessor(config.plugins);
    this.template = new Template(config);
    this.parsers = Object.assign({}, defaultParsers, config.parsers || {});
  }

  prepare() {
    const { outDir, templates } = this.config;
    // ensure the asset directory exists before copying assets
    fs.ensureDirSync(`${outDir}/assets`);
    const assetsCopied = new Map();

    const templateAssets = Object.keys(templates).reduce((memo, templateName) => {
      memo[templateName] = Object.keys(templates[templateName].assets).reduce((assets, assetType) => {
        assets[assetType] = templates[templateName].assets[assetType].map((asset) => {
          if (asset.copy && !assetsCopied.has(asset.path)) {
            try {
              fs.copySync(asset.path, `${outDir}/assets/${path.basename(asset.path)}`);
              assetsCopied.set(asset.path, true);
            } catch (e) {
              console.log(e);
            }
          }
          return {
            path: asset.copy ? `/assets/${path.basename(asset.path)}`: asset.path
          };
        });
        return assets;
      }, {});
      return memo;
    }, {});
    this.templateAssets = templateAssets;
  }

  parseFiles(files) {
    return files.map((file) => {
      // use default parser to parse js file
      // TODO support custom parser
      const Parser = this.parsers.simple;
      const parsedFile = Parser.execute(path.resolve(appRoot.toString(), file));
      return {
        path: file,
        data: this.pluginProcessor.transform(parsedFile)
      };
    });
  }

  getFiles() {
    return this.config.files.reduce((memo, pattern) => {
      memo = memo.concat(glob.sync(pattern));
      return memo;
    }, []);
  }

  filesToReprocess(meta) {
    return [...meta.values()]
      .filter(file => file.data.processOnWatch)
      .map(file => file.path);
  }

  processFiles(filesToUpdate, filesToDelete, changedOnWatch) {
    const { outDir, verbose, outputFilePath } = this.config;

    this.allFileMeta = this.allFileMeta || new Map();
    // remove meta for deleted files
    if (filesToDelete) {
      filesToDelete.forEach(file => this.allFileMeta.delete(file));
    }
    let files = filesToUpdate;

    if (changedOnWatch) {
      files = _.uniq(files.concat(this.filesToReprocess(this.allFileMeta)));
    }
    if (files.length === 0) {
      return;
    }
    const parsedFiles = this.parseFiles(files);
    const currentFiles = [];
    parsedFiles.forEach((file) => {
      currentFiles.push(file.data);
      file.data.filePath = file.path;
      this.allFileMeta.set(file.path, file);
    });
    const metaArray = this.flatternMeta(this.allFileMeta);
    const pluginData = this.pluginProcessor.publish(metaArray);

    currentFiles.forEach((file) => {
      if (pluginData) {
        file.plugged = pluginData;
      }
      const templateName = file.template || 'default';
      const templateAssets = this.templateAssets[templateName];
      file.jsAssets = templateAssets.js;
      file.cssAssets = templateAssets.css;
      const doc = Transformer.transform(this.template.getTemplate(templateName), file);
      const outputFilename = outputFilePath(file);
      const outputPath = path.dirname(outputFilename);

      if (outputFilename) {
        fs.ensureDirSync(path.resolve(outDir, outputPath));
        fs.writeFileSync(path.resolve(outDir, outputFilename), doc, 'utf8');
        if (verbose) {
          console.log(`${changedOnWatch ? 'Rew' : 'W'}riting: ${path.resolve(outDir, outputFilename)}`);
        }
      } else if (verbose) {
        console.log(`File: ${file.filePath} does not have a valid output path.`);
      }
    });
  }

  flatternMeta(meta) {
    return [...meta.values()].map(meta => meta.data);
  }

  execute() {
    this.prepare();
    this.processFiles(this.getFiles(), [], false);
  }
}

module.exports = Publisher;
