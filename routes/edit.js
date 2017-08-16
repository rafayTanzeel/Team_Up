'use strict';

const express = require('express');
const xssFilters = require('xss-filters');
const router = new express.Router();
const fs = require('fs');
const path = require('path');
const User = require('../models/User');

router.route('/profile')
  .get((req, res, next) => {
    let isSocial = false;
    if (req.user.facebook || req.user.twitter ||
          req.user.google) {
      isSocial = true;
    }
    res.render('edit', {
      title: 'Profile',
      csrfToken: req.csrfToken(),
      isSocial: isSocial,
    });

    return;
  })

  .post((req, res) => {
    const userId = req.user._id;

    const fname = xssFilters.inHTMLData(req.body.first_name);
    const lname = xssFilters.inHTMLData(req.body.last_name);
    const currentPass = xssFilters.inHTMLData(req.body.current_password);
    const newPass = xssFilters.inHTMLData(req.body.new_pass);

    User.findOne({
      _id: userId,
    }, (err, user) => {
      if (err) {
        throw err;
      }

      if (user) {
        if ( user.facebook || user.google || user.twitter) {
           res.json({error: 'Bad Request!', status: 403,
                    text: 'Cannot update social media accounts.'});
          return;
        }
        if (user.validPassword(currentPass)) {
          user.firstname = fname;
          user.lastname = lname;
          if (newPass) {
            user.password = newPass;
          }

          user.save((err) => {
             if (err) throw err;
          });

          res.json({success: 'Profile Updated!', status: 204,
                    text: 'Your personal info has been updated.',
                    redirect: '/edit/profile'});
        } else {
          res.json({error: 'Incorrect Password!', status: 403,
                    text: 'Please try again with your current password.'});
        }
      }

      return;
    });
  });

router.route('/uploadPic')
  .post((req, res) => {
    const userId = req.user._id;

    User.findOne({
        _id: userId,
      }, (err, user) => {
        if (err) {
          throw err;
        }

        if (user) {
          let randomNum = Math.floor(Math.random() * 50000);
          let ImageData = fs.readFileSync(req.file.path);
          let pubFolder = 'public/';
          let destFile = '/uploads/' + user.firstname + '_' +
                        user.lastname + user.identification + randomNum +
                        path.extname(req.file.originalname);
          let dest = pubFolder + destFile;

          fs.writeFile(dest, ImageData, 'binary',
            (err) => {
              if (err) throw err;
            });

          if (path.resolve(dest)) {
            user.image = destFile;
          }

          user.save((err) => {
            if (err) throw err;
          });

          fs.unlinkSync(req.file.path);
        }
      });

    return res.redirect('back');
  });

module.exports = router;
