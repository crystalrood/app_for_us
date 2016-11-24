const async = require('async');
const passport = require('passport');
//const Createschedule = require('../models/Createschedule');
/**
 * GET /books
 * List all books.
 */
const Createschedule = require('../models/Createschedule.js');


exports.getCreateschedule = (req, res, next) => {
  const errors = req.validationErrors();

  if (errors) {
    req.flash('errors', errors);
    return res.redirect('/createschedule');
  }

  Createschedule.find((err, docs) => {
    if (err) { return next(err); }
    docs.name = docs.length || '';
    //console.log(docs.name);
    //docs.user_id = user.id;
    res.render('createschedule', {createschedule: docs});

  })
};



exports.postCreateschedule = (req, res, next) => {
  req.assert('name', 'Name is not valid').len(2);

  const errors = req.validationErrors();

  if (errors) {
    req.flash('errors', errors);
    return res.redirect('/createschedule');
  }

  const createschedule = new Createschedule({
    name: req.body.name
  });


  createschedule.save((err) => {
    console.log("SAVED!");
    req.flash('success', { msg: 'This has been saved!' });
    res.redirect('/createschedule');
  if(err){
    console.error(err);
  }});
};
