/**
 * GET /books
 * List all books.
 */
const Shift_info = require('../models/Shift_info.js');

exports.getShift_info = (req, res) => {
  Shift_info.find((err, docs) => {
    res.render('shift_info', { shift_info: docs });
  });
};
