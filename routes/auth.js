'use strict';

const passport = require('passport');
const express = require('express');
const User = require('../models/User');
const RegisterValidation = require('../models/RegisterValidation');
const xssFilters = require('xss-filters');
const router = new express.Router();

// redirecting the user to google.com
router.route('/google')
  .get(passport.authenticate('google', {
    scope: [
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email',
    ],
  }));

// if auth pass or fails
router.route('/google/callback')
  .get(passport.authenticate('google', {
    successRedirect: '/',
    failureRedirect: '/',
    failureFlash: true,
  }));

// redirecting the user to twitter.com
router.route('/twitter')
  .get(passport.authenticate('twitter'));

// if auth pass or fails
router.route('/twitter/callback')
  .get(passport.authenticate('twitter', {
    successRedirect: '/',
    failureRedirect: '/',
    failureFlash: true,
  }));

// redirecting the user to twitter.com
router.route('/facebook')
  .get(passport.authenticate('facebook', {
    scope: [
      'email',
    ],
  }));

// if auth pass or fails
router.route('/facebook/callback')
  .get(passport.authenticate('facebook', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true,
  }));

router.route('/register')
  .post((req, res, next) => {
    req.checkBody('fname', 'Invalid First Name').notEmpty().isLength({
      min: 2,
    });
    req.checkBody('lname', 'Invalid Last Name').notEmpty().isLength({
      min: 2,
    });
    req.checkBody('email', 'Invalid Email').notEmpty().isEmail();
    req.checkBody('password', 'Invalid Password').notEmpty().isLength({
      min: 6,
    });
    req.checkBody('confirmPassword', 'Passwords do not match.').equals(req.body.password);

    req.getValidationResult().then((result) => {
      if (!result.isEmpty()) {
        let messages = [];
        let results = result.array();
        results.forEach((element) => {
          messages.push(element.msg);
        });
        req.flash('registerError', messages);
        return res.redirect('/');
      }

      const firstName = xssFilters.inHTMLData(req.body.fname);
      const lastName = xssFilters.inHTMLData(req.body.lname);
      const email = xssFilters.inHTMLData(req.body.email);
      const password = xssFilters.inHTMLData(req.body.password);
      const confirmPassword = xssFilters.inHTMLData(req.body.confirmPassword);

      User.findOne({
        'email': email,
      }, (err, user) => {
        if (err) {
          return done(err);
        }
        if (!user) {
          const user = new User({
            firstname: firstName,
            lastname: lastName,
            email: email,
            password: password,
            image: '/assets/images/raster/png/missing.png',
            status: 'Available',
          });

          user.save((err, user) => {
            if (err) throw err;
            req.flash('registerError', 'Register Successful');
            return res.redirect('/');
          });
        } else {
          req.flash('registerError', 'Email Already Exist');
          return res.redirect('/');
        }
      });
    });
  });

router.route('/deleteUser')
  .post((req, res) => {
    const userId = req.user._id;
    const userPass = xssFilters.inHTMLData(req.body.userPass);

    User.findOne({
      _id: userId,
    }, (err, user) => {
      if (err) {
        throw err;
      }

      if (user) {
        if ( user.facebook || user.google || user.twitter ) {
           res.json({error: 'Bad Request! Cannot delete social media accounts', status: 403});
          return;
        }

        if (user.validPassword(userPass)) {
          user.remove();
          res.json({success: 'Account Deleted!',
                  status: 204, redirect: '/auth/logout'});
        } else {
          res.json({error: 'The password you entered is incorrect. '
                            + 'Please try again', status: 403});
        }
      }

      return;
    });
  });

router.route('/changeStatus')
  .post((req, res) => {
    const userId = req.user._id;
    const status = xssFilters.inHTMLData(req.body.status);

    User.findOne({
      _id: userId,
    }, (err, user) => {
      if (err) {
        throw err;
      }
      if (user) {
        user.status = status;
        user.save((err, user) => {
            if (err) throw err;
        });
        res.json({success: 'Status changed.',
                    status: 204});
      }
    });

    return;
  });


router.route('/login')
  .post(passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/',
    failureFlash: true,
  }));

router.route('/logout')
  .get((req, res) => {
    req.logout();
    req.session.destroy();
    return res.redirect('/');
  });

router.use('/', (req, res, next) => {
  if (!req.user) {
    return res.redirect('/');
  }
  next();
});

module.exports = router;
