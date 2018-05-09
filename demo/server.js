const path = require('path');
const express = require('express');
const sane = require('sane');

const app = express();
let reload = false;
app.use(express.static('public'));

app.get('/reload', (req, res) => {
  const shouldReload = reload;
  reload = false;
  res.json({ reload: shouldReload });
});

app.listen(3000);
console.log('Start app at port: 3000');

const watcher = sane(path.resolve(__dirname, '../public'), {
  poll: true,
  dot: false
});

watcher.on('change', (filePath) => {
  console.log(`file change: ${filePath}, reloading`);
  reload = true;
});

watcher.on('add', (filePath) => {
  console.log(`file add: ${filePath}, reloading`);
  reload = true;
});
