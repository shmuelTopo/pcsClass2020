const express = require('express');
const router = express.Router();
const pool = require('../pool');

router.route('/')
  .get((req, res, next) => {
    pool.query('SELECT * FROM contacts', (error, results, fields) => {
      if (error) {
        //return res.sendStatus(500);
        res.statusCode = 500;
        return res.send(error.message);
      }

      res.send(results);
    });
  })
  .post((req, res, next) => {
    const { firstName, lastName, email, phone } = req.body;

    pool.query('INSERT INTO contacts (firstName, lastName, email, phone) VALUES(?,?,?,?)',
      [firstName, lastName, email, phone], (error, results, fields) => {
        if (error) {
          //return res.sendStatus(500);
          res.statusCode = 500;
          return res.send(error.message);
        }

        console.log(results);

        req.body.id = results.insertId;

        res.status(201)
          .location(`${req.baseUrl}/${req.body.id}`)
          .send(req.body);
      });
  });

router.route('/:id')
  .get((req, res, next) => {
    pool.query('SELECT * FROM contacts WHERE id = ?',
      [req.params.id], (error, results, fields) => {
        if (error) {
          //return res.sendStatus(500);
          res.statusCode = 500;
          return res.send(error.message);
        }

        //console.log(results);
        if (! results.length) {
          return res.sendStatus(404);
        }

        res.send(results[0]);
      });
  })
  .put((req, res, next) => {
    const { firstName, lastName, email, phone } = req.body;

    pool.query('UPDATE contacts SET firstName = ?, lastName = ?, email = ?, phone = ? WHERE id = ?',
      [firstName, lastName, email, phone, req.params.id], (error, results, fields) => {
        if (error) {
          //return res.sendStatus(500);
          res.statusCode = 500;
          return res.send(error.message);
        }

        console.log(results);
        if (!results.affectedRows) {
          return res.sendStatus(404);
        }

        res.sendStatus(204);
      });
  })
  .delete((req, res, next) => {
    pool.query('DELETE FROM contacts WHERE id = ?',
      [req.params.id], (error, results, fields) => {
        if (error) {
          //return res.sendStatus(500);
          res.statusCode = 500;
          return res.send(error.message);
        }

        //console.log(results);
        if (! results.affectedRows) {
          return res.sendStatus(404);
        }

        res.sendStatus(204);
      });
  });

module.exports = router;
