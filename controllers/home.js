/**
 * GET /
 * Home page.
 */

 const async = require('async');
 const passport = require('passport');
 const Modeledshift = require('../models/Modeledshift.js');
 const Quickshifts_customer_timeline = require('../models/Quickshifts_customer_timeline.js');
 var employee_type = 0
 var manager_user_id = 0
const Mgr_employee_link = require('../models/Mgr_employee_link.js');

exports.index = (req, res, next) => {

  //find it if it's a manager
   try{
    if (req.user.user_type == 'schedule_type') {


          var locals = {};
          var tasks = [
              function(callback){
                Modeledshift.find({manager_userid: req.user.id}, function (err, docs) {
                  if (err) { return callback(err); }
                  if (docs != null){
                    locals.modeledshifts = docs;
                    callback();
                  }
                  else{
                    locals.modeledshifts = docs;
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
            res.render('home', locals);
        });
    }





  //find if it's an employees
   if (req.user.user_type == 'employee_type') {

     //setting manager_id for employee, and employee type
     //based on data pulled for shifts
     //these variables are set as global variables above
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

         manager_user_id = result[0].mgr_userid
         employee_type = result[0].type
      });

      //**** about this code **** //
      //  below will be used on the employee to extract employee user_type, based on this i’ll pull the final employee shifts
      //function used to reset Finalemployeeshift database to match emp type = user id type (needed to cleanse from step above)


      var locals = {};
      var tasks = [
          function(callback){
            Modeledshift.find(
              {employee_userid: req.user.id},
              function (err, docs) {
              if (err) { return callback(err); }
              if (docs != null){
                console.log(docs.length)
                locals.modeledshifts = docs;
                callback();
              }
              else{
                locals.modeledshifts = docs;
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
                locals.schedule = docs2;
                callback();
              }
              else{
                locals.schedule = docs2;
                callback();
              }
            });
          },
      ];

    async.parallel(tasks, function(err) {
        if (err) return next(err);
        res.render('home', locals);
    });
}


  //if its someone not logged in
  }catch(e){
    if(e){
      console.log(e)
      res.render('home', {
        title: 'Home'
      });
    }
  }

};


exports.getFinalschedules = (req, res, next) => {


      res.render('home', {
        title: 'Home'
      });


};
