/**
 * GET /
 * Home page.
 */

 const async = require('async');
 const passport = require('passport');
 const Modeledshift = require('../models/Modeledshift.js');




exports.index = (req, res, next) => {

  //find it if it's a manager
   try{
    if (req.user.user_type == 'schedule_type') {
      Modeledshift.find({manager_userid: req.user.id},
      function (err, docs) {
        if (err) return handleError(err);
        res.render('home', { docs: docs });
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
