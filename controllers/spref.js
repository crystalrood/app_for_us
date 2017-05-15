/**
 * GET /spref
 * List all shift preferences (employees).
 */
const async = require('async');
const Spref = require('../models/Spref.js');
const People = require('../models/People.js');
const Mgr_employee_link = require('../models/Mgr_employee_link.js');
const Shifts = require('../models/Shift.js');
const Finalemployeeshift = require('../models/Finalemployeeshift.js');
const Actualfinalemployeeshift = require('../models/Actualfinalemployeeshift.js');
const Quickshifts_customer_timeline = require('../models/Quickshifts_customer_timeline.js');
const Secondaryshift = require('../models/Secondaryshift.js');
var employee_type = 0
var manager_user_id = 0

exports.getSpref = (req, res, next) => {
  console.log(req.user.id)
    People.findOne({$and:[
      { email: req.user.email}
      ]}, function (err,docs){
        if (err) { return callback(err); }
        manager_user_id=docs.mgr_userid
      })


     var locals = {};
     console.log(manager_user_id)
     console.log(employee_type)

     var tasks = [
         function(callback){
           Finalemployeeshift.find(
             { 'email': req.user.email }, function (err, docs) {
             if (err) { return callback(err); }
             if (docs != null){
               console.log("final_employee_shift "+docs.length)
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
           Quickshifts_customer_timeline.find(
             { 'manager_userid': manager_user_id },
             function (err, docs2) {
             if (err) { return callback(err); }
             if (docs2 != null){
               console.log("quickshift timelines " +docs2.length)
               locals.timeline = docs2;
               callback();
             }
             else{
               locals.timeline = docs2;
               callback();
             }
           });
         },

     ];

     async.parallel(tasks, function(err) {
         if (err) return next(err);
         res.render('spref', locals);
     });

   };













//add code in here to remove all shifts that doesn't match employee type




exports.postSprefUpdate = (req, res, next) => {
  /* this is removing the old employee .. in the future maybe we
  should change this to update*/
    Finalemployeeshift.update(
      {$and:[
      	{ userid: req.user.id},
      	{ date_range_start: req.body.date_range_start},
      	{ date_range_end: req.body.date_range_end},
      	{ employee_type: req.body.employee_type},
      	{ days_worked: req.body.days_worked},
      	{ num_employees: req.body.num_employees},
      	{ shift_start_time: req.body.shift_start_time},
        { shift_end_time: req.body.shift_end_time}
    	]},
      {$set:{
          userid: req.user.id,
          date_range_start: req.body.date_range_start,
          date_range_end: req.body.date_range_end,
          employee_type: req.body.employee_type,
          days_worked: req.body.days_worked,
          num_employees: req.body.num_employees,
          shift_start_time: req.body.shift_start_time,
          shift_end_time: req.body.shift_end_time,
          availability: req.body.availability
          }
        },
        function(err, result) {
            if (err) {
                console.log(err);
            }
            else {
              console.log('saved')
            }
        }

      )
    };


exports.postfinalSprefUpdate = (req, res, next) => {
  //calling secondary shift to see if there's anything in the collection...

console.log(req.body.date_range_start)
  console.log(req.body.date_range_end)
  Actualfinalemployeeshift.find(
    {$and:[{emp_userid: req.user.id}, {date_range_start: req.body.date_range_start}, {date_range_end: req.body.date_range_end}]},
    function (err, shifts) {
    if (err) return handleError(err);

      if (shifts.length == 0){

        Finalemployeeshift.find(
        {$and:[{userid: req.user.id}, {date_range_start: req.body.date_range_start}, {date_range_end: req.body.date_range_end}]},
        function (err, shft) {
          if (err) return handleError(err);
          //checking to ensure we're actually going to be adding documents
          if (shft.length >= 1){
            shft.forEach(function(shft, index) {

              const fin_shift = new Actualfinalemployeeshift({
                emp_userid: req.user.id,
                emp_email: req.user.email,
                date_range_start: shft.date_range_start,
                date_range_end: shft.date_range_end,
                employee_type: shft.employee_type,
                days_worked: shft.days_worked,
                num_employees: shft.num_employees,
                shift_start_time: shft.shift_start_time,
                shift_end_time: shft.shift_end_time,
                availability: shft.availability}
              );

              if (shft.availability == 'true'){
                fin_shift.save((err) => {
                  if (err) {return next(err);}
                  console.log("SAVED!");
                });
              }
            }
          );
          };
        });


      }
    }
  );

  res.redirect('/spref');
};
