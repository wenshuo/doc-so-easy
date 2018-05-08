#!/usr/bin/env node
const sane = require('sane');
const appRoot = require('app-root-path');
const Publisher = require('../src/publisher');
const config = require('../src/config');
const TaskQueue = require('../src/task_queue');
const tasks = new TaskQueue();
const publisher = new Publisher(config);

publisher.execute();

if(config.watch) {
  const watcher = sane(appRoot.toString(), { glob: config.files });
  // TODO batch file changes for some time interval
  watcher.on('change', (filePath) => {
    tasks.push({
      name: `change: ${filePath}`,
      fn: () => {
        return publisher.processFiles([filePath], [], true);
      }
    });
  });

  watcher.on('add', (filePath) => {
    tasks.push({
      name: `add: ${filePath}`,
      fn: () => {
        return publisher.processFiles([filePath], [], true);
      }
    });
  });

  watcher.on('delete', (filePath) => {
    tasks.push({
      name: `delete: ${filePath}`,
      fn: () => {
        return publisher.processFiles([], [filePath], true);
      }
    });
  });
}
