const { check } = require('express-validator');

module.exports = [
  check('username')
    .escape()
    .isAlphanumeric()
    .isLength({ min: 3, max: 30 })
    .notEmpty(),
  check('password')
    .isLength({ min: 5 })
    .notEmpty()
];