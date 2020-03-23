const router = require('express').Router();

const User = require('../models/User');

// GET all users
router.get('/', (req, res) => {
  User.findAll()
    .then(users => res.json(users))
    .catch(err => res.status(400).json(err));
});

module.exports = router;