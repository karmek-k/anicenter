const { validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const passport = require('passport');

const router = require('express').Router();

const { User } = require('../models/models');
const userValidator = require('../validators/user');

// GET all users
router.get('/list', (req, res) => {
  User.findAll({
    attributes: { exclude: ['password', 'isAdmin'] }
  })
    .then(users => res.json(users))
    .catch(err => res.status(400).json(err));
});

// GET one user
router.get('/retrieve/:id', (req, res) => {
  User.findByPk(req.params.id, {
    attributes: { exclude: ['password'] }
  })
    .then(user => res.json(user))
    .catch(() => res.status(400).json({ msg: 'Something went wrong...' }));
});

// POST a user
router.post('/register', userValidator, (req, res) => {
  // Check for malicious intents
  if (req.body.isAdmin) {
    return res.status(403).json({ msg: 'Why would you try to do that?' });
  }

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
    User.create(userData)
      .then(user => res.status(201).json({ id: user.id, username: user.username }))
      .catch(() => res.status(400).json({ msg: 'Can\'t create user' }));
  });
});

// PUT a user
router.put(
  '/update/:id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    // display an error message
    // when a user tries to update someone else's account
    // while not being an admin
    if (req.user.get('id') !== Number(req.params.id) && !req.user.get('isAdmin')) {
      return res.status(401).json({
        updated: false,
        msg: 'Operation not allowed'
      });
    }

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
        .then(updated => res.json({ updated: Boolean(updated) }))
        .catch(err => res.status(400).json(err));
    });
  }
);


// DELETE a user
router.delete(
  '/delete/:id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    if (req.user.get('id') !== Number(req.params.id) && !req.user.get('isAdmin')) {
      return res.status(401).json({
        deleted: false,
        msg: 'Operation not allowed'
      });
    }

    User.destroy({
      where: {
        id: req.params.id
      }
    })
      .then(deleted => res.json({ deleted: Boolean(deleted) }))
      .catch(err => res.status(400).json(err));
  }
);

// Obtain a JWT
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
              username: userData.username,
              userId: user.id
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