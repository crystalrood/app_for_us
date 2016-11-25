/**
 * GET /books
 * List all books.
 */
const People = require('../models/People.js');

exports.getPeople = (req, res) => {
  People.find((err, docs) => {
    res.render('people', { people: docs });
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
