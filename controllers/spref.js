/**
 * GET /spref
 * List all shift preferences (employees).
 */

const Spref = require('../models/Spref.js');
const People = require('../models/People.js');
const Mgr_employee_link = require('../models/Mgr_employee_link.js');
const Shifts = require('../models/Shift.js');
const Finalemployeeshift = require('../models/Finalemployeeshift.js');


exports.getSpref = (req, res) => {

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
          path: "$userid",
        }
      },
      {
        $lookup: {
          from: "shifts",
          localField: "userid",
          foreignField: "userid",
          as: "test2",
        }
      },
     {
      $project: {
        type: 1,
        userid: 1,
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

    //var db = mongoose.connect('mongodb://localhost:3000/test');

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
            console.log('madeit72')
             console.log(err);
             return;
         }
         //console.log(result)
        // console.log(result);
        // console.log('madeit77')
         //adding some stuff here
      //console.log(result);
        var final_result = [];
        //console.log(result)
         result.forEach(function(result, index) {
           var str = result.shifts_match_employee_type.days_worked
           var str_array = str.split(',')

           for(var i = 0; i < str_array.length; i++) {
             // Trim the excess whitespace.
             str_array[i] = str_array[i].replace(/^\s*/, "").replace(/\s*$/, "");

             var new_result = new Finalemployeeshift({
               userid: req.user.email,
               date_range_start: result.shifts_match_employee_type.date_range_start,
               date_range_end: result.shifts_match_employee_type.date_range_end,
               employee_type: result.shifts_match_employee_type.employee_type,
               days_worked: str_array[i],
               num_employees: result.shifts_match_employee_type.num_employees,
               shift_start_time:result.shifts_match_employee_type.shift_start_time,
               shift_end_time: result.shifts_match_employee_type.shift_end_time,
             })

             ;
             //console.log(new_result)
             //onsole.log(str_array.length)
             //console.log(str_array[i])

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

            // final_result.push(new_result);
          //  console.log(new_result)
          }



         });

     });

     //function used to reset Finalemployeeshift database to match emp type = user id type (needed to cleanse from step above)
     People.find({ 'email': req.user.email }, function (err,docs){
       if (err) { return callback(err); }
       //syntax for calling docs array
       var usertype = docs[0].type
       Finalemployeeshift.find(  {$and:[
         	{ userid: req.user.email},
         	{ employee_type: usertype},


       	]}, function (err, docs2) {
         if (err) { return callback(err); }
         res.render('spref', { spref: docs2 });
       });

     }

     )

//add code in here to remove all shifts that doesn't match employee type

};



exports.postSprefUpdate = (req, res, next) => {
  /* this is removing the old employee .. in the future maybe we
  should change this to update*/
    Finalemployeeshift.update(
      {$and:[
      	{ userid: req.user.email},
      	{ date_range_start: req.body.date_range_start},
      	{ date_range_end: req.body.date_range_end},
      	{ employee_type: req.body.employee_type},
      	{ days_worked: req.body.days_worked},
      	{ num_employees: req.body.num_employees},
      	{ shift_start_time: req.body.shift_start_time},
        { shift_end_time: req.body.shift_end_time}
    	]},
      {$set:{
          userid: req.user.email,
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
