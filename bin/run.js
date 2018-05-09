#!/usr/bin/env node
const sane = require('sane');
const path = require('path');
const appRoot = require('app-root-path');
const Publisher = require('../src/publisher');
const config = require('../src/config');
const TaskQueue = require('../src/task_queue');
const tasks = new TaskQueue();
const publisher = new Publisher(config);

if (config.directoryToWatch) {
  console.log(`Watching directory: ${config.directoryToWatch}`);
}

publisher.execute();

if(config.directoryToWatch) {
  // TODO get rid of poll
  const watcher = sane(config.directoryToWatch, {
    glob: config.files,
    poll: true,
    dot: false
  });
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
