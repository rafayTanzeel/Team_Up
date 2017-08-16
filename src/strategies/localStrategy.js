'use strict';

const passport = require('passport');
const User = require('../../models/User');
const xssFilters = require('xss-filters');
const LocalStrategy = require('passport-local').Strategy;


module.exports = () => {
  passport.use(new LocalStrategy({
      usernameField: 'email',
      passwordField: 'password',
    },
    (username, password, done) => {
      User.findOne({
        'email': xssFilters.inHTMLData(username),
      }, (err, user) => {
        if (err) {
          return done(err);
        }
        if (!user) {
          return done(null, false, {
            message: 'User Doesn\'t Exist',
          });
        }
        if (!user.validPassword(xssFilters.inHTMLData(password))) {
          return done(null, false, {
            message: 'Incorrect Email or Password',
          });
        } else {
          return done(null, user);
        }
      });
    }
  ));
};
