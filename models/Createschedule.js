const mongoose = require('mongoose');

const createscheduleSchema = new mongoose.Schema({
  userid: String,
  name: String},
  { timestamps: true });

const Createschedule = mongoose.model('Createschedule', createscheduleSchema);

module.exports = Createschedule;
