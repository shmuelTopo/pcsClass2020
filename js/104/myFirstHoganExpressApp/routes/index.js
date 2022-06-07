var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {

  const things = [1,2,3,4,5];

  res.render('index', {
    title: 'Express',
    foo: 'foo',
    people: [
      { name: 'Joe Biden' },
      { name: 'Kamala Harris'},
      { name: 'Bernie Sanders'}
    ],
    iqs: [20, 30, 15],
    things: things,
    noThings: things.length === 0
  });
});

router.get('/bar', function (req, res, next) {
  res.render('index', { title: 'Bar' });
});

module.exports = router;
