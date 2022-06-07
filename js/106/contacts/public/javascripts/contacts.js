/*global pcs*/
(async function () {
  'use strict';

  const addContactForm = $('#addContactForm');
  const contactsTable = $('#contactsTable tbody');
  const firstNameInput = $('#first');
  const lastNameInput = $('#last');
  const emailInput = $('#email');
  const phoneInput = $('#phone');

  let contacts = [];

  function showContactForm(contact) {
    if (contact) {
      firstNameInput.val(contact.firstName);
      lastNameInput.val(contact.lastName);
      emailInput.val(contact.email);
      phoneInput.val(contact.phone);

      addContactForm.data('contact', contact);
    }

    addContactForm.slideDown('slow');
  }

  $('#addContact').click(() => {
    showContactForm();
  });

  async function addContact(newContact) {
    if (!contacts.length) {
      $(':first-child', contactsTable).remove();
    }

    contacts.push(newContact);

    const row = $(`
        <tr>
          <td>${newContact.firstName}</td>
          <td>${newContact.lastName}</td>
          <td>${newContact.email}</td>
          <td>${newContact.phone}</td>
          <td>
            <button class="edit">edit</button>
            <button class="delete">delete</button>
          </td>
        </tr>
    `).appendTo(contactsTable);

    newContact.row = row;

    row.find('.edit')
      .click(async () => {
        showContactForm(newContact);
      });

    row.find('.delete')
      .click(async () => {
        try {
          const r = await fetch(`/api/contacts/${newContact.id}`, {
            method: 'DELETE'
          });

          if (!r.ok) {
            const errorText = await r.text();
            throw new Error(`Unable to delete contact - ${errorText}`);
          }

          row.remove();
          contacts = contacts.filter(c => c !== newContact);

          if (!contacts.length) {
            contactsTable.append(`<tr><td colspan="5">no contacts loaded</td></tr>`);
          }
        } catch (e) {
          pcs.messageBox.show(e.message);
        }
      });
  }

  addContactForm.submit(async event => {
    event.preventDefault();

    const newContact = {
      firstName: firstNameInput.val(),
      lastName: lastNameInput.val(),
      email: emailInput.val(),
      phone: phoneInput.val()
    };

    const existingContact = addContactForm.data('contact');
    const url = existingContact ? `/api/contacts/${existingContact.id}` : '/api/contacts';
    const method = existingContact ? 'PUT' : 'POST';
    try {
      const r = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newContact)
      });

      if (!r.ok) {
        const errorText = await r.text();
        throw new Error(`Unable to ${existingContact ? 'update' : 'add'} contact - ${errorText}`);
      }

      if (existingContact) {
        Object.assign(existingContact, newContact);
        const tds = existingContact.row.find('td');
        tds[0].textContent = newContact.firstName;
        tds[1].textContent = newContact.lastName;
        tds[2].textContent = newContact.email;
        tds[3].textContent = newContact.phone;
      } else {
        const createdContact = await r.json();
        addContact(createdContact);
      }

      hideAndResetAddContactForm();
    } catch (e) {
      pcs.messageBox.show(e.message);
    }
  });

  $('#cancel').click(() => {
    hideAndResetAddContactForm();
  });

  function hideAndResetAddContactForm() {
    addContactForm.trigger('reset');
    addContactForm.data('contact', null);

    addContactForm.slideUp('fast');
  }

  try {
    const r = await fetch('/api/contacts');
    if (!r.ok) {
      const errorText = await r.text();
      throw new Error(`Unable to get contacts - ${errorText}`);
    }
    const newContacts = await r.json();
    newContacts.forEach(addContact);
  } catch (err) {
    pcs.messageBox.show(err, true);
  }

}());