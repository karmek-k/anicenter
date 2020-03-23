const { validationResult } = require('express-validator');
const bcrypt = require('bcrypt');

const router = require('express').Router();

const User = require('../models/User');
const userValidator = require('../validators/user');

// GET all users
router.get('/', (req, res) => {
  User.findAll({
    attributes: { exclude: ['password'] }
  })
    .then(users => res.json(users))
    .catch(err => res.status(400).json(err));
});

// POST a user
router.post('/register', userValidator, (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  const userData = {
    username: req.body.username,
    password: req.body.password
  }

  // Create a hashed password
  bcrypt.hash(userData.password, 12, (err, hash) => {
    if (err) {
      throw err;
    }

    userData.password = hash;

    // Save the user to the db
    User.create(userData);

    res.json(userData);
  });
});

module.exports = router;