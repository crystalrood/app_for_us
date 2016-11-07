const async = require('async');
const passport = require('passport');
//const Createschedule = require('../models/Createschedule');

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
