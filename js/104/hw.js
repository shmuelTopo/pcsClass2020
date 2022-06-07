const { nextTick } = require('process');

//const app = require('connect')();
const app = require('express')();

app.use('/home', (req, res) => {
  res.end('This is the home page');
});

app.use('/about', (req, res) => {
  res.end('This is the about page');
});

//app.use(require('./queryParser'));
//app.use(require('./magicword')('foo'));

app.use(require('./basicAuth')({name:'admin', pwd:'secret'}));

app.use('/admin', (req, res) => {
  res.end('This is the admin page');
});

app.listen(80);