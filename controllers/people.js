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
