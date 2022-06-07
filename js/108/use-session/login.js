const pool = require('./pool');
const bcrypt = require('bcrypt');

module.exports = (req, res, next) => {
  pool.query('SELECT password FROM users WHERE name = ?',
    [req.body.username],
    (err, results, fields) => {
      if (err) {
        return next(err);
      }
      if (!results.length) {
        return next(new Error('Invalid user name or password'));
      }
      bcrypt.compare(req.body.password, results[0].password, (err, result) => {
        if (err) {
          return next(err);
        }
        if (!result) {
          return next(new Error('Invalid user name or password'));
        }
        req.session.user = req.body.username;
        res.redirect('/admin');
      });
    });
};