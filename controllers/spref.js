/**
 * GET /spref
 * List all shift preferences (employees).
 */

const Spref = require('../models/Spref.js');

exports.getSpref = (req, res) => {
  Spref.find((err, docs) => {
    res.render('spref', { spref: docs });
  });
};
