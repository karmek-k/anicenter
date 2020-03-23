const { validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

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

// GET one user by id
router.get('/:id', (req, res) => {
  User.findByPk(req.params.id, {
    attributes: { exclude: ['password'] }
  })
    .then(user => res.json(user))
    .catch(err => res.status(404).json(err));
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
  };

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

// PUT a user
router.put('/update/:id', (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  const userData = {
    password: req.body.password
  };

  bcrypt.hash(userData.password, 12, (err, hash) => {
    if (err) {
      throw err;
    }
    
    userData.password = hash;
    
    User.update(userData, {
      where: {
        id: req.params.id
      }
    })
      .then(user => res.json(user))
      .catch(err => res.status(400).json(err));
  });
});

// DELETE a user
router.delete('/delete/:id', (req, res) => {
  User.destroy({
    where: {
      id: req.params.id
    }
  })
    .then(result => res.json(result))
    .catch(err => res.status(400).json(err));
});

router.post('/login', (req, res) => {
  const userData = {
    username: req.body.username,
    password: req.body.password
  };

  User.findOne({ 
    where: {
      username: userData.username
    }
  })
    .then(user => {
      if (!user) {
        return res.status(404).json({ msg: 'User not found' });
      }

      // Compare passwords
      bcrypt.compare(
        userData.password,
        user.get('password'),
        (err, same) => {
          if (err) {
            throw err;
          }

          if (same) {
            // Sign the token
            const payload = {
              username: userData.username
            };
            jwt.sign(
              payload,
              process.env.SECRET_KEY,
              { expiresIn: '6h' },
              (err, token) => {
                if (err) {
                  throw err;
                }

                res.json({
                  token: 'Bearer ' + token
                });
              }
            );
          }
          // wrong password
          else {
            return res.status(401).json({
              token: null,
              msg: 'Wrong credentials'
            });
          }
      });
    })
    .catch(err => res.status(400).json(err));
});

module.exports = router;