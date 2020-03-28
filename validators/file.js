const { check } = require('express-validator');

module.exports = [
  check('filename')
    .escape()
    .notEmpty()
    .isAlphanumeric()
    .isLength({ min: 5, max: 100 }),
  check('title')
    .escape()
    .notEmpty()
    .isLength({ min: 5, max: 100}),
  check('description')
    .escape()
    .isLength({ max: 300 })
];