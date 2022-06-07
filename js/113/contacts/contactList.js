const mongoose = require('mongoose');
const { Schema } = mongoose;

const contactListSchema = new Schema({
  name: { type: String, required: true },
  contacts: [{ type: Schema.Types.ObjectId, ref: 'Contact' }]
});

contactListSchema.methods.print = function () {
  console.log(`${this.name}`);
  this.contacts.forEach(contact => console.log(contact));
}

module.exports = mongoose.model('ContactList', contactListSchema);