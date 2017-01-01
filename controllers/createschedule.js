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





exports.getCreateschedule = (req, res, next) => {

  Secondaryshift.find(
  {$and:[{userid: req.user.id}, {date_range_start: req.body.start_date}, {date_range_end: req.body.end_date}]},
  function (err, docs) {
    if (err) return handleError(err);
    res.render('createschedule', { shift: docs });
    console.log(docs.length)
  });

    //console.log(req.body.cb)
};


exports.postCreatescheduledata = (req,res,next) => {

  //  res.redirect('/createschedule');
  Secondaryshift.find(
  {$and:[{userid: req.user.id}, {date_range_start: req.body.start_date}, {date_range_end: req.body.end_date}]},
  function (err, docs) {
    if (err) return handleError(err);
    //res.render('createschedule', docs);
    //res.render('createschedule', { shift: docs.toString() });

    console.log('mimsey')
    console.log(docs.length)
    res.send(docs)
  });


}


exports.postCreateschedule = (req, res, next) => {


  //testing to make sure that date range picker brings in dates selected
  console.log(req.body.start_date);
  console.log(req.body.end_date);

  //calling secondary shift to see if there's anything in the collection...
  Secondaryshift.find(
    {$and:[{userid: req.user.id}, {date_range_start: req.body.start_date}, {date_range_end: req.body.end_date}]},
    function (err, shifts) {
      //if error return error message
      if (err) return handleError(err);
      //checking to see if the shift length is 0, if so we're going to create a new collection
      if (shifts.length == 0){

        //now since there is no record, we're going to find the shift's from
        //manager preferences
          Shift.find({ 'userid': req.user.id }, function (err, shft) {
            if (err) return handleError(err);
            //checking to ensure we're actually going to be adding documents
            if (shft.length >= 1){
              //iterating through each document and adding it to the
              //secondary collection
              shft.forEach(function(shft, index) {

                const sec_shift = new Secondaryshift({
                  userid: req.user.id,
                  date_range_start: req.body.start_date,
                  date_range_end: req.body.end_date,
                  employee_type: shft.employee_type,
                  days_worked: shft.days_worked,
                  num_employees: shft.num_employees,
                  shift_start_time: shft.shift_start_time,
                  shift_end_time: shft.shift_end_time}
                );

                sec_shift.save((err) => {
                  if (err) {return next(err);}
                  console.log("SAVED!");
                });
              });
            }
          });
      };
    });
      res.redirect('/createschedule');
};

/*


const sec_shift = new Secondaryshift({
  userid: String,
  date_range_start: String,
  date_range_end: String,
  employee_type: String,
  days_worked: String,
  num_employees: Number,
  shift_start_time: String,
  shift_end_time: String}
);

shift.save((err) => {

  if (err) {
    return next(err);
  }
  console.log("SAVED!");
  req.flash('success', { msg: 'This shift has been saved!' });
  res.redirect('/people');
});

}

}
*/



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
