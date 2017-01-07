/**
 * GET /spref
 * List all shift preferences (employees).
 */

const Spref = require('../models/Spref.js');
const People = require('../models/People.js');
const Mgr_employee_link = require('../models/Mgr_employee_link.js');
const Shifts = require('../models/Shift.js');


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
        from: "shifts",
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
        // console.log(result);
        // console.log('madeit77')
         //adding some stuff here
         var final_result = [];

         result.forEach(function(result, index) {

           var str = result.shifts_match_employee_type.days_worked
           var str_array = str.split(',')

           for(var i = 0; i < str_array.length; i++) {
             // Trim the excess whitespace.
             str_array[i] = str_array[i].replace(/^\s*/, "").replace(/\s*$/, "");

             var new_result = {
               employee_type: result.shifts_match_employee_type.employee_type,
               days_worked: str_array[i],
               num_employees: result.shifts_match_employee_type.num_employees,
               shift_start_time:result.shifts_match_employee_type.shift_start_time,
               shift_end_time: result.shifts_match_employee_type.shift_end_time
             }
             final_result.push(new_result);
          //  console.log(new_result)
          }


           //console.log(new_result)
         });

         console.log(final_result)
         res.render('spref',{ spref: final_result });
     });


};
