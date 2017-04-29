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


  // **** what does this code do? **** //
  //  Maps employee emails --> manager user id’s (should we change this to be a more concrete database
  //  End result is a table that has manager user_id, employee type, and employee email

  People.aggregate(
    [
      {
        $lookup: {
          from: "users",
          localField: "email",
          foreignField: "email",
          as: "test"
        }
      },
      {
        $unwind: {
          path: "$mgr_userid",
        }
      },
      {
        $lookup: {
          from: "shifts",
          localField: "mgr_userid",
          foreignField: "userid",
          as: "test2",
        }
      },
     {
      $project: {
        type: 1,
        mgr_userid: 1,
        email: 1,
      },
    },
    {
      $match: { email: req.user.email }
    },
    {
        $out : "mgr_employee_links"
      }
  ], function (err, result) {
        if (err) {
            console.log(err);
            return;
        }
    });

    // **** what does this code do? **** //
    //Manager employee ink aggregated
    // From manager employee links, will try to match shifts from manager db based on employee type
      //*****If the employee shifts have at least 1 item then nothing new is added to the DB (THIS NEEDS TO BE FIXED)
      //*******Problem 1: if the manager adds shifts to the db this list become outdated
      //*******Problem 2:  employee won’t get new shifts added to their drop down...again another out data problem..this needs to be done better
    // Else, all of the manager existing shifts are added to the database

    Mgr_employee_link.aggregate([{
      $lookup: {
        from: "finalshifts",
        localField: "type",
        foreignField: "employee_type",
        as: "shifts_match_employee_type"
      }
      },
          { "$unwind": "$shifts_match_employee_type" },
      {
          $match: { "shifts_match_employee_type.userid": {$ne:null} }
        }],
        function (err, result) {

         if (err) {
             console.log(err);
             return;
         }

        var final_result = [];

        //setting manager_id for employee, and employee type
        //based on data pulled for shifts
        //these variables are set as global variables above
        manager_user_id = result[0].mgr_userid
        employee_type = result[0].type

         result.forEach(function(result, index) {
           var str = result.shifts_match_employee_type.days_worked
           var str_array = str.split(',')

           for(var i = 0; i < str_array.length; i++) {
             // Trim the excess whitespace.
             str_array[i] = str_array[i].replace(/^\s*/, "").replace(/\s*$/, "");

             var new_result = new Finalemployeeshift({
               userid: req.user.id,
               date_range_start: result.shifts_match_employee_type.date_range_start,
               date_range_end: result.shifts_match_employee_type.date_range_end,
               employee_type: result.shifts_match_employee_type.employee_type,
               days_worked: str_array[i],
               num_employees: result.shifts_match_employee_type.num_employees,
               shift_start_time:result.shifts_match_employee_type.shift_start_time,
               shift_end_time: result.shifts_match_employee_type.shift_end_time,
             });

             Finalemployeeshift.update(
               {$and:[
                 {userid: new_result.userid},
                 {date_range_start: new_result.date_range_start},
                 {date_range_end: new_result.date_range_end},
                 {employee_type: new_result.employee_type},
                 {days_worked:  new_result.days_worked},
                 {num_employees: new_result.num_employees},
                 {shift_start_time: new_result.shift_start_time},
                 {shift_end_time: new_result.shift_end_time}
               ]},
               {$set:
                 {userid: new_result.userid,
                 date_range_start: new_result.date_range_start,
                 date_range_end: new_result.date_range_end,
                 employee_type: new_result.employee_type,
                 days_worked:  new_result.days_worked,
                 num_employees: new_result.num_employees,
                 shift_start_time: new_result.shift_start_time,
                 shift_end_time: new_result.shift_end_time}
               },
               {upsert: true},
                 function(err, test) {
                     if (err) {
                         console.log(err);
                     }
                     else {
                         //console.log(test);
                     }
                 }
               );
          }



         });

     });

     //**** about this code **** //
     //  below will be used on the employee to extract employee user_type, based on this i’ll pull the final employee shifts
     //function used to reset Finalemployeeshift database to match emp type = user id type (needed to cleanse from step above)





     var locals = {};
     console.log(manager_user_id)
     console.log(employee_type)

     var tasks = [
         function(callback){
           Finalemployeeshift.find(
             { 'userid': req.user.id }, function (err, docs) {
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

         function(callback){
           Secondaryshift.find(
             {$and:[{ 'userid': manager_user_id }, {employee_type: employee_type}]},
             function (err, docs3) {
             if (err) { return callback(err); }
             if (docs3 != null){
               console.log('secondar shifts ' +docs3.length)
               locals.manager_shifts = docs3;
               callback();
             }
             else{
               locals.manager_shifts = docs3;
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
