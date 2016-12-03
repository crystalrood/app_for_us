/**
 * GET /books
 * List all books.
 */
const People = require('../models/People.js');
const Shift = require('../models/Shift.js');
const Employeetype = require('../models/Employeetype.js');

exports.getPeople = (req, res, next) => {
  People.find({ 'userid': req.user.id }, function (err, docs) {
    if (err) { return next(err); }
    if (docs != null){
      console.log(docs.length)
      docs.forEach(function(docs, index) {
        console.log(index + " key: " + docs.name)
        console.log(docs)
      });
      res.render('people', { people: docs});
    }
    else{
      res.render('people', { people:docs});
    }

  });
};


exports.postPeople = (req, res, next) => {
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
      userid: req.user.id,
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


exports.getShift = (req, res) => {
  res.render('/people', {
    title: 'Account Management'
  });
};



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






exports.getEmployeetype = (req, res) => {
  res.render('/people', {
    title: 'Account Management'
  });
};



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
