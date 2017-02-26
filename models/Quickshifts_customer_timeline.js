const mongoose = require('mongoose');

const quickshifts_customer_timelineSchema = new mongoose.Schema({
  manager_userid: String,
  emp_email: String,
  schedule_start: String,
  schedule_end: String,
  final_schedule_release: String,
  lockout_day_all: String,
  employee_lockout: Number,
  manager_lockout: String},
  { timestamps: true }
);

const Quickshifts_customer_timeline = mongoose.model('quickshifts_customer_timeline', quickshifts_customer_timelineSchema);
module.exports = Quickshifts_customer_timeline;
