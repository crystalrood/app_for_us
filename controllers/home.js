/**
 * GET /
 * Home page.
 */

 const async = require('async');
 const passport = require('passport');
 const Modeledshift = require('../models/Modeledshift.js');
 const Quickshifts_customer_timeline = require('../models/Quickshifts_customer_timeline.js');



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
            console.log(locals)
            res.render('home', locals);
        });


    }



  //find if it's an employees
   if (req.user.user_type == 'employee_type') {

      res.render('home', {
        title: 'Home'
      });

    }
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
