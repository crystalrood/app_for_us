const mongoose = require('mongoose');

const schedulestart_managerSchema = new mongoose.Schema({
  manager_userid: String,
  manager_email: String,
  day_schedule_start: String,
  is_default_time_okay: String,
  if_no_first_start: String,
  schedule_first_start_date: String

},
  { timestamps: true }
);

const Schedulestart_manager = mongoose.model('schedulestart_manager', schedulestart_managerSchema);
module.exports = Schedulestart_manager;
