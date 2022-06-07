const app = require('express')();

app.get('/joeBidenPoll', (req, res, next) => {
  res.send({first: 'Joe', last: 'Biden', poll: '2020-03-03'});
});

app.get('/sayHello', (req, res, next) => {
  res.send(`Hello ${req.query.name}`);
});

app.get('/sayHello/:name', (req, res, next) => {
  res.send(`Hello2 ${req.params.name}`);
});

app.get('/getReport/:year/:month/:day', (req, res, next) => {
  res.send(`report for ${req.params.year}-${req.params.month}-${req.params.day}`);
});

app.param('userId', (req, res, next) => {
  // pretend to fetch from db
  req.user = {
    id: req.params.userId,
    name: 'Joe Biden',
    email: 'jbiden@whitehouse.gov'
  };
  next();
});

app.get('/a/:userId', (req, res, next) => {
  res.send({method:'a', user: req.user});
});

app.get('/b/:userId', (req, res, next) => {
  res.send({ method: 'b', user: req.user });
});

app.listen(80);