const contact = require('./contact');

(async () => {
  const mongoose = require('mongoose');
  await mongoose.connect('mongodb://localhost:27017/contacts');

  const Contact = require('./contact');
  const joe = new Contact({
    name: 'Joe',
    phone: '123-456-7890',
    email: 'jbidem@whitehouse.gov'
  });
  joe.save();

  const ContactList = require('./contactList');
  const contactList1 = new ContactList({
    name: 'Contact List #1'
  });

  const contactList2 = new ContactList({
    name: 'Contact List #2'
  });

  contactList1.contacts.push(joe.id);
  contactList2.contacts.push(joe.id);

  await contactList1.save();
  await contactList2.save();

  contactList1.print();
  contactList2.print();

  const loadedList = await ContactList.findOne();
  loadedList.print();

  const lists = await ContactList.find().populate('contacts').exec();
  lists.forEach(list => list.print());
})();