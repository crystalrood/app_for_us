const mongoose = require('mongoose');

const shift_infoSchema = new mongoose.Schema({
  name: String
});

const Shift_info= mongoose.model('shift_info', shift_infoSchema);
module.exports = Shift_info;
