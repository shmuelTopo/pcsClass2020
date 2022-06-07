const bcrypt = require('bcrypt');
const pool = require('./pool');

module.exports = (req, res, next) => {
  if (! req.body.username || ! req.body.password) {
     return next(new Error('Username and password are required'));
  }

  bcrypt.hash(req.body.password, 10, (err, hash) =>{
    if(err) {
      return next(err);
    }

    pool.query('INSERT INTO users (name, password) VALUES (?, ?)',
      [req.body.username, hash],
      (err, results, fields) => {
        if (err) {
          return next(new Error(err.code === 'ER_DUP_ENTRY' ? 'Username already exists' : err.message));
        }
        res.redirect('/');
      });
  });
};