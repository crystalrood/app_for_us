const mongoose = require('mongoose');

const peopleSchema = new mongoose.Schema({
  name: String
});

const People= mongoose.model('people', peopleSchema);
module.exports = People;
