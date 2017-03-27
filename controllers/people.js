/**
 * GET /books
 * List all books.
 */
const async = require('async');
const People = require('../models/People.js');
const Shift = require('../models/Shift.js');
const Employeetype = require('../models/Employeetype.js');
const Schedulestart_manager = require('../models/Schedulestart_manager.js');
const Quickshifts_customer_timeline = require('../models/Quickshifts_customer_timeline.js');


/*
-----------------------------------------------------
-------GETTING ALL INFORMATION NEEDED FOR PAGE LOAD
-----------------------------------------------------
*/

exports.getPeople = (req, res, next) => {
  var locals = {};
  var tasks = [
      function(callback){
        People.find({ 'mgr_userid': req.user.id }, function (err, docs) {
          if (err) { return callback(err); }
          if (docs != null){
            locals.people = docs;
            callback();
          }
          else{
            locals.people = docs;
            callback();
          }
        });
      },


      function(callback){
        Shift.find({ 'userid': req.user.id }, function (err, docs1) {
          if (err) { return next(err); }
          if (docs1 != null){
            locals.shift = docs1;
            callback();
          }
          else{
            locals.shift = docs1;
            callback();
          }

        });
      },

      function(callback){
        Employeetype.find({ 'userid': req.user.id }, function (err, docs2) {
          if (err) { return next(err); }
          if (docs2 != null){
            locals.employeetype = docs2;
            callback();
          }
          else{
            locals.employeetype = docs2;
            callback();
          }

        });
      },

      function(callback){
        Schedulestart_manager.find({ 'manager_userid': req.user.id }, function (err, docs3) {
          if (err) { return next(err); }
          if (docs3 != null){
            locals.schedule = docs3;
            callback();
          }
          else{
            locals.schedule = docs3;
            callback();
          }
          console.log(docs3)
        });
      },
  ];

  async.parallel(tasks, function(err) {
      if (err) return next(err);
      res.render('people', locals);
  });
};






/*
-----------------------------------------------------
-----------------------------------------------------
-----------------------------------------------------
-------EMPLOYEES [Getting, Posting, Editing, and Deleteing]
-----------------------------------------------------
-----------------------------------------------------
*/


/*
------- Posting information from webform for employees
*/

exports.postPeople = (req, res, next) => {
  /* this maybe able to be taken out*/
    req.assert('name', 'Name is not valid').len(2);
    req.assert('type', 'Please ensure employee type or role is correct').len(2);
    req.assert('email', 'Please enter a valid email address.').isEmail();



    const errors = req.validationErrors();

    if (errors) {
      req.flash('errors', errors);
      return res.redirect('/people');
    }
    /* define what needs to be saved*/
    const people = new People({
      mgr_userid: req.user.id,
      name: req.body.name,
      type: req.body.type,
      min_hours: req.body.min_hours,
      max_hours: req.body.max_hours,
      email: req.body.email,
      phone_number:req.body.phone_number
    });

    people.save((err) => {
      /* this provides a block if the error is that hte email address is already associated with an employee*/
      if (err) {
        if (err.code === 11000) {
          req.flash('errors', { msg: 'The email address you have entered is already associated with an account.' });
          return res.redirect('/people');
        }
        return next(err);
      }
      console.log("SAVED!");
      req.flash('success', { msg: 'This has been saved!' });
      res.redirect('/people');
});
};



/*
------- [Getting] Updated employee information
*/


exports.getUpdatePeople = (req, res) => {
    res.render('/people', {
      title: 'Account Management'
    });
};



/*
------- [Posting] Updated employee information
*/


exports.postUpdatePeople = (req, res, next) => {

  /* this is removing the old employee .. in the future maybe we
  should change this to update*/
    People.update(
      {$and:[
      	{ mgr_userid: req.user.id, },
      	{ name: req.body.old_name},
      	{ type: req.body.old_type},
      	{ min_hours: req.body.old_min_hours},
      	{ max_hours: req.body.old_max_hours},
      	{ email: req.body.old_email},
      	{ phone_number: req.body.old_phone_number}
    	]},
      {$set:{
          mgr_userid: req.user.id,
          name: req.body.name,
          type: req.body.type,
          min_hours: req.body.min_hours,
          max_hours: req.body.max_hours,
          email: req.body.email,
          phone_number:req.body.phone_number}
        },

        function(err, result) {
            if (err) {
                console.log(err);
            }
            else {
                console.log(result);
            }
        }

      )
    };






/*
------- [Deleting] Updated employee information
*/


exports.postDeletePeople = (req, res, next) => {

  People.remove({$and:[
    { mgr_userid: req.user.id},
    { name: req.body.name},
    { type: req.body.type},
    { min_hours: req.body.min_hours},
    { max_hours: req.body.max_hours},
    { email: req.body.email},
    { phone_number: req.body.phone_number}
    ]}, (err) =>
      {
        if (err) { return next(err); }
        console.log("employees deleted");
      }
    );
};







/*
-----------------------------------------------------
-----------------------------------------------------
-----------------------------------------------------
-------SHIFTS [Getting, Posting, Editing, and Deleteing]
-----------------------------------------------------
-----------------------------------------------------
*/




/*
------- [Getting] Shift informaiton
*/

exports.getShift = (req, res) => {


  res.render('/people', {
    title: 'Account Management'
  });
};






/*
------- [Posting] shift information from webform
*/

exports.postShift = (req, res, next) => {

    const errors = req.validationErrors();

    if (errors) {
      req.flash('errors', errors);
      return res.redirect('/people');
    }
    /* define what needs to be saved*/
    const shift = new Shift({
      userid: req.user.id,
      employee_type: req.body.employee_type,
      days_worked: req.body.days_week_worked,
      num_employees: req.body.num_employees,
      shift_start_time: req.body.start_time,
      shift_end_time: req.body.end_time
    });

    shift.save((err) => {
      /* this provides a block if the error is that hte email address is already associated with an employee*/
      if (err) {
        return next(err);
      }
      console.log("SAVED!");
      req.flash('success', { msg: 'This shift has been saved!' });
      res.redirect('/people');
});
};





/*
------- [Posting] Updated shift information
*/


exports.postUpdateShift = (req, res, next) => {

  Shift.update(
    {$and:[
    { userid: req.user.id },
    { employee_type: req.body.old_employee_type },
    { days_worked: req.body.old_days_worked},
    { num_employees: req.body.old_num_employees},
    { shift_start_time: req.body.old_shift_start_time},
    { shift_end_time: req.body.old_shift_end_time}
    ]},
    {$set:
      {userid: req.user.id,
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
    )
  };





/*
------- [Getting] Updated shift information
*/

exports.getUpdateShift = (req, res) => {
    res.render('/people', {
      title: 'Account Management'
    });
};




/*
------- [Delete] Delete shift
*/


exports.postDeleteShift = (req, res, next) => {

  Shift.remove({$and:[
    { userid: req.user.id },
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
-----------------------------------------------------
-----------------------------------------------------
-------EMPLOYEE TYPE [Getting, Posting, Editing, and Deleteing]
-----------------------------------------------------
-----------------------------------------------------
*/




/*
------- Getting
*/

exports.getEmployeetype = (req, res) => {
  res.render('/people');
};




/*
------- Posting information from webform
*/

exports.postEmployeetype = (req, res, next) => {

    const errors = req.validationErrors();

    if (errors) {
      req.flash('errors', errors);
      return res.redirect('/people');
    }
    /* define what needs to be saved*/
    const employeetype = new Employeetype({
      userid: req.user.id,
      employee_type: req.body.employee_type_define
    });

    employeetype.save((err) => {
      /* this provides a block if the error is that hte email address is already associated with an employee*/
      if (err) {
        return next(err);
      }
      console.log("SAVED!");
      req.flash('success', { msg: 'This shift has been saved!' });
      res.redirect('/people');
});
};



/*
------- [Delete] Delete shift
*/


exports.postDeleteEmployeetype = (req, res, next) => {

  Employeetype.remove({$and:[
    { userid: req.user.id },
    { employee_type: req.body.employee_type }
    ]}, (err) =>
      {
        if (err) { return next(err); }
        console.log("employee deleted");
      }
    );
};






/*
-----------------------------------------------------
-----------------------------------------------------
-----------------------------------------------------
-------Schedule Start day [Getting, Posting, Editing, and Deleteing]
-----------------------------------------------------
-----------------------------------------------------
*/




/*
------- [Getting] Shift informaiton
*/

exports.getSchedulestart = (req, res) => {
  res.render('/people', {
    title: 'Account Management'
  });
};




/*
------- [Posting] shift information from webform
*/

exports.postSchedulestart = (req, res, next) => {

    const errors = req.validationErrors();

    if (errors) {
      req.flash('errors', errors);
      return res.redirect('/people');
    }

    Schedulestart_manager.find({ 'manager_userid': req.user.id }, function (err,docs){
      if (err) { return callback(err); }

      //if there is not schedule start
      if (docs.length == 0){

          /* define what needs to be saved*/
        const schedulestart_manager = new Schedulestart_manager({
            manager_userid: req.user.id,
            manager_email: req.user.email,
            day_schedule_start: req.body.days_week_worked,
            is_default_time_okay: req.body.is_default_time_okay,
            if_no_first_start: req.body.if_no_first_start,
            schedule_first_start_date: req.body.schedule_first_start_date

          });

        schedulestart_manager.save((err) => {
          if (err) {
            return next(err);
          }
          console.log("SAVED!");
          res.redirect('/people');
        });


      }



      //this piece of code will only run if something already exists
      if(docs.length >0){
        if (err) {
          return next(err);
        }
        Schedulestart_manager.update(
          {$and:[
            {manager_userid: req.user.id},
            {manager_email: req.user.email},
            {day_schedule_start: docs[0].day_schedule_start}
        	]},
          {$set:{
              manager_userid: req.user.id,
              manager_email: req.user.email,
              day_schedule_start: req.body.days_week_worked,
              is_default_time_okay: req.body.is_default_time_okay,
              if_no_first_start: req.body.if_no_first_start,
              schedule_first_start_date: req.body.schedule_first_start_date}
            },

            function(err, result) {
                if (err) {
                    console.log(err);
                }
                else {
                    console.log(result);
                }
            }
        )

      //****************************************************************************************
      //****************************************************************************************
      //****************************************************************************************
      //*****here i need to create a function that looks out 10 weeks to plan the schedule *****//

      //setting first schedule variables
      var schedule_start;

      if (req.body.is_default_time_okay = 'Yes'){
        schedule_start = new Date(req.body.schedule_first_start_date);
      }
      else {
        schedule_start = new Date(req.body.if_no_first_start);
      }

      var schedule_end = new Date(schedule_start.getTime() + (7*60*60*24*1000));
      var schedule_release = new Date(schedule_start.getTime() - (7*60*60*24*1000));
      var employee_lockout = new Date(schedule_start.getTime() - (8*60*60*24*1000));
      var manager_lockout = new Date(schedule_start.getTime() - (13*60*60*24*1000));

      //need to delete whatever is in the database already for a given manager

      Quickshifts_customer_timeline.remove({$and:[
        { manager_userid: req.user.id},
        { manager_email: req.user.email}
        ]}, (err) =>
          {
            if (err) { return next(err); }
            console.log("schedule deleted");
          }
        );


      //setting up the schedule outline to put into the database
      for (i = 0; i <= 5; i++) {

        schedule_start.setTime((schedule_start.getTime()+(i*7*60*60*24*1000)));
        schedule_end.setTime((schedule_end.getTime()+(i*7*60*60*24*1000)));
        schedule_release.setTime((schedule_release.getTime()+(i*7*60*60*24*1000)));
        employee_lockout.setTime((employee_lockout.getTime()+(i*7*60*60*24*1000)));
        manager_lockout.setTime((manager_lockout.getTime()+(i*7*60*60*24*1000)));


        /* define what needs to be saved*/
        const quickshifts_customer_timeline = new Quickshifts_customer_timeline({
          "week_num": i,
          "manager_userid" : req.user.id,
          "manager_email"  : req.user.email,
          "schedule_start" : schedule_start.toDateString(),
          "schedule_end"  : schedule_end.toDateString(),
          "final_schedule_release"  : schedule_release.toDateString(),
          "employee_lockout"  : employee_lockout.toDateString(),
          "manager_lockout"  : manager_lockout.toDateString()
          });

        quickshifts_customer_timeline.save((err) => {
          if (err) {
            return next(err);
          }
          console.log("SAVED!");
        });


      }

      //console.log(req.body.days_week_worked)
      //console.log(req.body.is_default_time_okay)
      //console.log(req.body.if_no_first_start)
      //console.log(req.body.schedule_first_start_date)
      //****************************************************************************************
      //****************************************************************************************
      //****************************************************************************************

        res.redirect('/people');
      }
    }
)};
