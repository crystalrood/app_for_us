const mongoose = require('mongoose');

const peopleSchema = new mongoose.Schema({
  userid: String,
  name: String,
  type: String,
  min_hours: Number,
  max_hours: Number,
  email: { type: String, unique: true },
  phone_number: String},
  { timestamps: true }
);

const People= mongoose.model('people', peopleSchema);
module.exports = People;
