const express = require('express');
const app = express();
let reload = true;
app.use(express.static('public'));

app.get('/reload/:isFirst', (req, res) => {
  const shouldReload = reload;

  if (req.params.isFirst === 'yes') {
    reload = false;
  }
  res.json({ reload: shouldReload });
});

app.listen(3000);
console.log('Start app at port: 3000');
