const mongoose = require('mongoose');

const modeledshiftSchema = new mongoose.Schema({
  manger_userid: String,
  manager_email: String,
  employee_userid: String,
  employee_email: String,
  employee_name: String,
  employee_type: String,
  day_of_week: String,
  date: String,
  shift_time_start: String,
  shift_time_end: String,
  shift_date_range: String,
  num_employees_working: String,
  { timestamps: true }
);

const Modeledshift = mongoose.model('modeledshift', modeledshiftSchema);
module.exports = Modeledshift;
