const express = require('express');
const router = express.Router();
const pool = require('../pool');
const Joi = require('joi');

const contactSchema = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string()
    .alphanum()
    .min(3)
    .max(8)
    .required(),
  email: Joi.string().allow(''),
  phone: Joi.string().allow('')
});

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

    const result = contactSchema.validate(req.body, {abortEarly: false});
    if (result.error) {
      return res.status(401).send(result.error.message);
    }


    /*if(!lastName || lastName.length < 3 || lastName.length > 8) {
      res.statusCode = 401;
      return res.send('Last name must be between 3 and 8 characters');
    }*/

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

    const result = contactSchema.validate(req.body, { abortEarly: false });
    if (result.error) {
      return res.status(401).send(result.error.message);
    }
    
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
