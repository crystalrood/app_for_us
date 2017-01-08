const mongoose = require('mongoose');

const finalemployeeshiftSchema = new mongoose.Schema({
  userid: String,
  date_range_start: String,
  date_range_end: String,
  employee_type: String,
  days_worked: String,
  num_employees: Number,
  shift_start_time: String,
  shift_end_time: String,
  availability: String},
  { timestamps: true }
);

const Finalemployeeshift = mongoose.model('finalemployeeshift', finalemployeeshiftSchema);
module.exports = Finalemployeeshift;
