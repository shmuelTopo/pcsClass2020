var express = require('express');
var router = express.Router();

/* GET home page. */
router.route('/')
  .get((req, res, next) => {
    res.render('index', { title: 'Express', name: req.signedCookies.name/* || 'Guest'*/ });
  })
  .post((req, res, next) => {
    res.cookie('name', req.body.name, { maxAge: 20000, httpOnly: true, signed: true, secure: true });
    res.redirect('/');
  });

module.exports = router;
