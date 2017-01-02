const mongoose = require('mongoose');

const mgr_employee_linkSchema = new mongoose.Schema({
  userid: String,
  type: String,
  email: String},
  { timestamps: false });

const Mgr_employee_link = mongoose.model('Mgr_employee_link', mgr_employee_linkSchema);

module.exports = Mgr_employee_link;
