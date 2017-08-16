'use strict';

const nconf = require('../config/nconfConfig');
const passport = require('passport');
const User = require('../../models/User');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

module.exports = () => {
  passport.use(new GoogleStrategy({
      clientID: nconf.get('google:clientID'),
      clientSecret: nconf.get('google:clientSecret'),
      callbackURL: nconf.get('google:callbackURL'),
    },
    (accessToken, refreshToken, profile, done) => {
      const query = {
        'google.id': profile.id,
      };

      // console.log(profile);
      User.findOne(query, (err, user) => {
        if (!user) {
          const userDocument = new User({
            firstname: profile.name.givenName,
            lastname: profile.name.familyName,
            email: profile.emails[0].value,
            image: profile._json.image.isDefault ? '/assets/images/raster/png/missing.png' : profile._json.image.url,
            displayName: profile.displayName,
            google: {
              id: profile.id,
              token: accessToken,
            },
          });
          userDocument.save((err, user) => {
            if (err) {
              return done(null, false, {
                message: 'Please Retry',
              });
            }
            done(null, user);
          });
        } else {
          done(null, user);
        }
      });
    }));
};
