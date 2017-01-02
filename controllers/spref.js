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
      console.log(result)
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
         console.log(result);
         console.log('madeit77')
         res.render('spref',{ spref: result });
     });


};
