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


exports.postCreateschedule = (req, res) => {
  req.assert('test', 'Name cannot be blank').notEmpty();

  const errors = req.validationErrors();

  if (errors) {
    req.flash('errors', errors);
    return res.redirect('/createschedule');
  };

    req.flash('success', { msg: 'Email has been sent successfully!' });
    res.redirect('/createschedule');
  });
};
