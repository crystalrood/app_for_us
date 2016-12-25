const mongoose = require('mongoose');

const finalshiftSchema = new mongoose.Schema({
  userid: String,
  date_range: String,
  employee_type: String,
  days_worked: String,
  num_employees: Number,
  shift_start_time: String,
  shift_end_time: String},
  { timestamps: true }
);

const Finalshift = mongoose.model('finalshift', shiftSchema);
module.exports = Finalshift;
