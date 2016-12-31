const async = require('async');
const passport = require('passport');
//const Createschedule = require('../models/Createschedule');
/**
 * GET /books
 * List all books.
 */
const Createschedule = require('../models/Createschedule.js');
const People = require('../models/People.js');
const Shift = require('../models/Shift.js');
const Employeetype = require('../models/Employeetype.js');
const Finalshift = require('../models/Finalshift.js');
const Secondaryshift = require('../models/Secondaryshift.js');





exports.getCreateschedule = (req, res) => {
    Shift.find({ 'userid': req.user.id }, function (err, shifts) {
      if (err) return handleError(err);
      //trying to iterate through the docs
      if (shifts != null){
      //  console.log(shifts);
      }
    });

    Secondaryshift.find((err, docs) => {
    //  console.log(docs)
      res.render('createschedule', { createschedule: docs });
    });
    //console.log(req.body.cb)
  };





  exports.postCreateschedule = (req, res, next) => {

    console.log(req.body.start_date);
    console.log(req.body.end_date);
    res.redirect('/createschedule');

  };





  /*
  xports.postCreateschedule = (req, res, next) => {
    req.assert('name', 'Name is not valid').len(2);

    const errors = req.validationErrors();

    if (errors) {
      req.flash('errors', errors);
      return res.redirect('/createschedule');
    }

    const createschedule = new Createschedule({
      userid: req.user.id,
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
  */


/*exports.getCreateschedule = (req, res, next) => {
  const errors = req.validationErrors();
  if (errors) {
    req.flash('errors', errors);
    return res.redirect('/createschedule');
  }
  Createschedule.findOne({ 'name': 'testformimsey' }, 'name', function (err, createschedule) {
    if (err) return handleError(err);
    if (createschedule != null){
      console.log('%s is a.', createschedule.name)
    } // Space Ghost is a talk show host.
  })
//returns the user id that matches the user id that's currently logged in
  Createschedule.findOne({ 'userid': req.user.id }, 'userid', function (err, createschedule) {
    if (err) return handleError(err);
    if (createschedule != null){
      console.log('%s is a.', createschedule.userid)
    } // Space Ghost is a talk show host.
  })
  //this will createschedule that has all the information in the data base that matches the user_id
  Createschedule.find({ 'userid': req.user.id }, function (err, createschedule) {
    if (err) return handleError(err);
    if (createschedule != null){
      console.log('%s is a.', createschedule)
    } // Space Ghost is a talk show host.
  })
//this will createschedule that has all the information in the data base that matches the user_id
  Createschedule.find({ 'userid': req.user.id }, function (err, createschedule) {
    if (err) return handleError(err);
    //trying to iterate through the docs
    if (createschedule != null){
      createschedule.forEach(function(createschedule, index) {
        console.log(index + " key: " + createschedule.name)
      });
      console.log('%s is a.', createschedule)
    } // Space Ghost is a talk show host.
  })
  Createschedule.find((err, docs) => {
    if (err) { return next(err); }
    if (docs != null){
      docs.name = docs.length || '';
      console.log(docs.length);
      res.render('createschedule', {createschedule: docs})
    }
  })
};
*/


/*
  const errors = req.validationErrors();
  if (errors) {
    req.flash('errors', errors);
    return res.redirect('/createschedule');
  }
  Createschedule.findOne({ 'name': 'asdf' }, 'name', function (err, createschedule) {
    if (err) return handleError(err);
    console.log('%s is a.', createschedule.name) // Space Ghost is a talk show host.
  })
  Createschedule.find((err, docs) => {
    if (err) { return next(err); }
    docs.name = docs.length || '';
    console.log(docs.length);
    res.render('createschedule', {createschedule: docs});
  })
};
*/
