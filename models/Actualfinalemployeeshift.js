const mongoose = require('mongoose');

const actualfinalemployeeshiftSchema = new mongoose.Schema({
  emp_userid: String,
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

const Actualfinalemployeeshift = mongoose.model('actualfinalemployeeshift', actualfinalemployeeshiftSchema);
module.exports = Actualfinalemployeeshift;
