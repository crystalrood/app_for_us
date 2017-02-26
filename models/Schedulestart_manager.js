const mongoose = require('mongoose');

const schedulestart_managerSchema = new mongoose.Schema({
  manager_userid: String,
  manager_email: String,
  day_schedule_start: String},
  { timestamps: true }
);

const Schedulestart_manager = mongoose.model('schedulestart_manager', schedulestart_managerSchema);
module.exports = Schedulestart_manager;
