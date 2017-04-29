const async = require('async');
const passport = require('passport');

const Createschedule = require('../models/Createschedule.js');
const People = require('../models/People.js');
const Shift = require('../models/Shift.js');
const Employeetype = require('../models/Employeetype.js');
const Finalshift = require('../models/Finalshift.js');
const Secondaryshift = require('../models/Secondaryshift.js');
const Quickshifts_customer_timeline = require('../models/Quickshifts_customer_timeline.js');




exports.getCreateschedule = (req, res, next) => {

    var locals = {};
    var tasks = [
        function(callback){
          Secondaryshift.find({userid: req.user.id}, function (err, docs) {
            if (err) { return callback(err); }
            if (docs != null){
              locals.shifts = docs;
              callback();
            }
            else{
              locals.shifts = docs;
              callback();
            }
          });
        },


        function(callback){
            Quickshifts_customer_timeline.find({manager_userid: req.user.id}, function (err, docs1) {
            if (err) { return next(err); }
            if (docs1 != null){
              locals.schedule = docs1;
              callback();
            }
            else{
              locals.schedule = docs1;
              callback();
            }

          });
        },



    ];

  async.parallel(tasks, function(err) {
      if (err) return next(err);
      res.render('createschedule', locals);
  });

};




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
    console.log(sec_shift)
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




  exports.postCreateschedulefinal = (req, res, next) => {

    //calling secondary shift to see if there's anything in the collection...
    Finalshift.find(
      {$and:[{userid: req.user.id}, {date_range_start: req.body.date_range_start}, {date_range_end: req.body.date_range_end}]},
      function (err, shifts) {

        //if error return error message
        if (err) return handleError(err);
        //checking to see if the shift length is 0, if so we're going to create a new collection
        if (shifts.length == 0){


          //now since there is no record, we're going to find the shift's from
          //manager preferences
            console.log(req.body.date_range_start.length)
            console.log(req.body.date_range_end.length)
            Secondaryshift.find(
            {$and:[{userid: req.user.id}, {date_range_start: req.body.date_range_start}, {date_range_end: req.body.date_range_end}]},
            function (err, shft) {
              if (err) return handleError(err);
              //checking to ensure we're actually going to be adding documents
              if (shft.length >= 1){
                //iterating through each document and adding it to the
                //secondary collection
                shft.forEach(function(shft, index) {

                  const sec_shift = new Finalshift({
                    userid: req.user.id,
                    date_range_start: req.body.date_range_start,
                    date_range_end: req.body.date_range_end,
                    employee_type: shft.employee_type,
                    days_worked: shft.days_worked,
                    num_employees: shft.num_employees,
                    shift_start_time: shft.shift_start_time,
                    shift_end_time: shft.shift_end_time}
                  );
                  console.log(sec_shift)
                  sec_shift.save((err) => {
                    if (err) {return next(err);}
                    console.log("SAVED!");
                  });
                });
              };
                });
              }
            });

    res.redirect('/createschedule');
  };
