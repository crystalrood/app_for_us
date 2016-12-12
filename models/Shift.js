const mongoose = require('mongoose');

const shiftSchema = new mongoose.Schema({
  userid: String,
  employee_type: String,
  days_worked: String,
  num_employees: Number,
  shift_start_time: String,
  shift_end_time: String},
  { timestamps: true }
);

const Shift = mongoose.model('shift', shiftSchema);
module.exports = Shift;
