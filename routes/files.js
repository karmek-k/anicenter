const path = require('path');

const passport = require('passport');
const jwt = require('jsonwebtoken');
const router = require('express').Router();
const { validationResult } = require('express-validator');

const { File } = require('../models/models');
const fileValidators = require('../validators/file');

// Saves an uploaded file
router.post(
  '/upload',
  fileValidators,
  passport.authenticate('jwt', { session: false }, null),
  (req, res) => {
    // User id
    const userId = jwt.verify(
      req.headers.authorization.slice(7),
      process.env.SECRET_KEY
    ).userId;

    // Check if there is an actual file
    if (!req.files) {
      return res.status(422).json({ msg: 'No file has been sent' })
    }

    // Validate file data
    const fileData = {
      filename: req.body.filename || req.files.upload.name,
      title: req.body.title,
      description: req.body.description,
      userId,
    };
    const errors = validationResult(fileData);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    // Save to disk and db
    const fileFolder = path.join(
      __dirname, process.env.UPLOADS_PATH, String(fileData.userId)
    );
    const filePath = path.join(fileFolder, fileData.filename);
    console.log(fileData);
    File.create(fileData)
      .then(file => {
        req.files.upload.mv(filePath);
        res.status(201).json(file);
      })
      .catch(err => res.status(400).json(err));
  }
);

module.exports = router;