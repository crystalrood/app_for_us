const mongoose = require('mongoose');

const sprefSchema = new mongoose.Schema({
  name: String
});

const Spref = mongoose.model('Book', sprefSchema);
module.exports = Spref;
