/**
 * GET /books
 * List all books.
 */
const Createschedule = require('../models/Createschedule.js');

exports.getCreateschedule = (req, res) => {
  Createschedule.find((err, docs) => {
    res.render('createschedule', { createschedule: docs });
  });
};
