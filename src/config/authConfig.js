'use strict';

const _ = require('lodash');
const passport = require('passport');
const User = require('../../models/User');

module.exports = (serverConfig) => {
  serverConfig.use(passport.initialize());
  serverConfig.use(passport.session());

  serverConfig.use((req, res, next) => {
    res.locals.isAuth = req.isAuthenticated();
    if (_.has(req, 'user')) {
      const userStatus = req.user.status ? req.user.status : 'Available';
      req.user.displayName = req.user.firstname + ' ' + req.user.lastname;
      res.locals.userData = {
        name: _.startCase(req.user.displayName),
        email: req.user.email,
        image: req.user.image,
        firstname: _.startCase(req.user.firstname),
        lastname: _.startCase(req.user.lastname),
        status: userStatus,
        facebookId: req.user.facebook,
        twitterId: req.user.twitter,
        googleId: req.user.google,
        userId: req.user.firstname + '_' + req.user.lastname + req.user.identification,
      };
    }

    next();
  });

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      if (!user) {
        return done(null, false);
      } else {
        done(null, user);
      }
    });
    // done(null, id);
  });

  require('../strategies/localStrategy')();
  require('../strategies/googleStrategy')();
  require('../strategies/twitterStrategy')();
  require('../strategies/facebookStrategy')();
};
