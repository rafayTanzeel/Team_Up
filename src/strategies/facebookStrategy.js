'use strict';

const nconf = require('../config/nconfConfig');
const passport = require('passport');
const User = require('../../models/User');
const FacebookStrategy = require('passport-facebook').Strategy;

module.exports = () => {
  passport.use(new FacebookStrategy({
      clientID: nconf.get('facebook:clientID'),
      clientSecret: nconf.get('facebook:clientSecret'),
      callbackURL: nconf.get('facebook:callbackURL'),
      profileFields: ['id', 'email', 'gender', 'link', 'locale', 'name', 'timezone', 'updated_time', 'verified', 'picture.type(large)'],
    },
    (accessToken, refreshToken, profile, done) => {
      const query = {
        'facebook.id': profile.id,
      };

      // console.log(profile);
      User.findOne(query, (err, user) => {
        if (!user) {
          const userDocument = new User({
            email: profile.emails[0].value,
            firstname: profile.name.givenName,
            lastname: profile.name.familyName,
            image: profile._json.picture.data.is_silhouette ? '/assets/images/raster/png/missing.png' : profile.photos[0].value,
            displayName: profile.displayName,
            facebook: {
              id: profile.id,
              token: accessToken,
              tokenSecret: refreshToken,
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
