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


//this one is called to just pull the data from secondary shifts to the webform
exports.postCreatescheduledata = (req,res,next) => {

  Secondaryshift.find(
  {$and:[{userid: req.user.id}, {date_range_start: req.body.start_date}, {date_range_end: req.body.end_date}]},
  function (err, docs) {
    if (err) return handleError(err);
    //res.render('createschedule', docs);
    //res.render('createschedule', { shift: docs.toString() });

    res.send(docs)
  });

}


exports.postCreateschedule = (req, res, next) => {

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



exports.postUpdateSecondaryShift = (req, res, next) => {

  console.log(req.body.date_range_start)
  console.log(req.body.old_employee_type)

  if(req.body.old_employee_type != undefined){
    Secondaryshift.update(
      {$and:[
      { userid: req.user.id },
      { date_range_start: req.body.date_range_start},
      { date_range_end: req.body.date_range_end},
      { employee_type: req.body.old_employee_type },
      { days_worked: req.body.old_days_worked},
      { num_employees: req.body.old_num_employees},
      { shift_start_time: req.body.old_shift_start_time},
      { shift_end_time: req.body.old_shift_end_time}
      ]},
      {$set:
        {userid: req.user.id,
        date_range_start: req.body.date_range_start,
        date_range_end: req.body.date_range_end,
        employee_type: req.body.employee_type,
        days_worked: req.body.days_worked,
        num_employees: req.body.num_employees,
        shift_start_time: req.body.shift_start_time,
        shift_end_time: req.body.shift_end_time}
      },
        function(err, result) {
            if (err) {
                console.log(err);
            }
            else {
                console.log(result);
            }
        }
      );
  }

  if(req.body.old_employee_type == undefined){
    const sec_shift = new Secondaryshift({
      userid: req.user.id,
      date_range_start: req.body.date_range_start,
      date_range_end: req.body.date_range_end,
      employee_type: req.body.employee_type,
      days_worked: req.body.days_worked,
      num_employees: req.body.num_employees,
      shift_start_time: req.body.shift_start_time,
      shift_end_time: req.body.shift_end_time}
    );

    sec_shift.save((err) => {
      if (err) {return next(err);}
      console.log("SAVED!");
    });
  }



  };


  exports.postDeleteSecondaryShift = (req, res, next) => {

    Secondaryshift.remove({$and:[
      { userid: req.user.id },
      { date_range_start: req.body.date_range_start},
      { date_range_end: req.body.date_range_end},
      { employee_type: req.body.employee_type },
      { days_worked: req.body.days_worked},
      { num_employees: req.body.num_employees},
      { shift_start_time: req.body.shift_start_time},
      { shift_end_time: req.body.shift_end_time}
      ]}, (err) =>
        {
          if (err) { return next(err); }
          console.log("shift deleted");
        }
      );
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
