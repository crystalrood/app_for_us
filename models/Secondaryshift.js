const mongoose = require('mongoose');

const secondaryshiftSchema = new mongoose.Schema({
  userid: String,
  date_range: String,
  employee_type: String,
  days_worked: String,
  num_employees: Number,
  shift_start_time: String,
  shift_end_time: String},
  { timestamps: true }
);

const Secondaryshift = mongoose.model('secondaryshift', secondaryshiftSchema);
module.exports = Secondaryshift;
