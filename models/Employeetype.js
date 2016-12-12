const mongoose = require('mongoose');

const employeetypeSchema = new mongoose.Schema({
  userid: String,
  employee_type: String},
  { timestamps: true }
);

const Employeetype = mongoose.model('employeetype', employeetypeSchema);
module.exports = Employeetype;
