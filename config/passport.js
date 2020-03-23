const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

const User = require('../models/User');

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.SECRET_KEY
};

const strategy = new JwtStrategy(opts, (payload, done) => {
  User.findOne({
    where: { username: payload.username }
  })
    .then(user => {
      if (user) {
        return done(null, user);
      }
      else {
        return done(null, false);
      }
    })
    .catch(err => {
      return done(err, false);
    });
});

module.exports = passport => {
  passport.use(strategy);
};