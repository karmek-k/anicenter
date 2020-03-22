const router = require('express').Router();

const User = require('../models/User');

// GET all users
router.get('/', (req, res) => {
  User.findAll()
    .then(users => res.json(users));
});

module.exports = router;