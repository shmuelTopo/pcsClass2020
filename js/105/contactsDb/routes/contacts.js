var debug = require('debug')('contacts:route');
const { signedCookie } = require('cookie-parser');
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
  connection.query('SELECT * FROM contacts', (error, results, fields) => {
    if (error) throw error;

    debug(`get returning ${JSON.stringify(results)}`);

    res.render('layout', {
      title: 'Contacts',
      contacts: results,
      noContacts: results.length === 0,
      css: ['contacts.css'],
      partials: { content: 'contacts' }
    });
  });
});

router.get('/addContact', (req, res, next) => {
  res.render('layout', {
    title: 'Add Contact',
    css: ['contact.css'],
    partials: { content: 'contact' }
  });
});

router.post('/addContact', (req, res, next) => {
  connection.query('INSERT INTO contacts(firstName, lastName, email, phone) VALUES(?, ?, ?, ?)',
    [req.body.firstName, req.body.lastName, req.body.email, req.body.phone],
    (error, results, fields) => {
      if (error) throw error;

      res.redirect('/contacts');
    });
});

router.get('/editContact/:id', (req, res, next) => {
  connection.query('SELECT * FROM contacts WHERE id = ?',
    [req.params.id],
    (error, results, fields) => {
      if (error) throw error;

      if (!results.length) {
        return next(new Error('No contact found with id ' + req.params.id));
      }

      res.render('layout', {
        title: 'Edit Contact',
        css: ['contact.css'],
        contact: results[0],
        partials: { content: 'contact' }
      });
    });
});

router.post('/editContact/:id', (req, res, next) => {
  connection.query('UPDATE contacts SET firstName = ?, lastName = ?, email = ?, phone = ? WHERE id = ?',
    [req.body.firstName, req.body.lastName, req.body.email, req.body.phone, req.params.id],
    (error, results, fields) => {
      if (error) throw error;

      res.redirect('/contacts');
    });
});

router.get('/deleteContact/:id', (req, res, next) => {
  connection.query('DELETE FROM contacts WHERE id = ?',
    [req.params.id],
    (error, results, fields) => {
      console.log(results);
      if (error) return next(error);

      if (!results.affectedRows) {
        return next(new Error('No contact found with id ' + req.params.id));
      }

      res.redirect('/contacts');
    });
});

module.exports = router;
