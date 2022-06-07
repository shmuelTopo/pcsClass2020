const { signedCookie } = require('cookie-parser');
var express = require('express');
var router = express.Router();

let contacts = [{
  id: 1,
  firstName: 'Joe',
  lastName: 'Biden',
  email: 'jbiden@whitehouse.gov',
  phone: '202-555-1111'
},
{
  id: 2,
  firstName: 'Kamala',
  lastName: 'Harris',
  email: 'kharris@whitehouse.gov',
  phone: '202-444-2222'
}];

let nextId = contacts.length + 1;

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('layout', {
    title: 'Contacts',
    contacts,
    noContacts: contacts.length === 0,
    css: ['contacts.css'],
    partials: { content: 'contacts' }
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
  req.body.id = nextId++;
  contacts.push(req.body);
  res.redirect('/contacts');
});

router.get('/editContact/:id', (req, res, next) => {
  let contact = contacts.find(c => c.id === +req.params.id);

  res.render('layout', {
    title: 'Edit Contact',
    css: ['contact.css'],
    contact,
    partials: { content: 'contact' }
  });
});

router.post('/editContact/:id', (req, res, next) => {
  let contact = contacts.find(c => c.id === +req.params.id);

  Object.assign(contact, req.body);

  res.redirect('/contacts');
});

router.get('/deleteContact/:id', (req, res, next) => {
  contacts = contacts.filter(contact => contact.id !== parseInt(req.params.id));

  res.redirect('/contacts');
});

module.exports = router;
