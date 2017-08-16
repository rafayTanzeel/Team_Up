'use strict';

const express = require('express');
const _ = require('lodash');
const router = new express.Router();
const moment = require("moment");

/* GET home page */
router.route('/')
  .get((req, res, next) => {
    const messagesErrSignIn = req.flash('error');
    const messagesErrRegister = req.flash('registerError');
    const messages = messagesErrSignIn.concat(messagesErrRegister);


    // Execute DB queries if there is no error or user is defined
    if (_.has(req, 'user') && messages.length <= 0) {
      const Event = require('../models/Event');

      // Get user specific events
      Event.find({ users: {$eq: req.user._id.toString()} }).populate('createdBy').
                    populate('users').sort('from').exec((err, events) => {
        let from = [];
        let to = [];
        for (let i = 0; i < events.length; i++) {
          from.push(moment(events[i].from).format('ddd DD MMM YYYY hh:mm A'));
          to.push(moment(events[i].to).format('ddd DD MMM YYYY hh:mm A'));
        }
        res.render('index', {
          title: 'Home',
          csrfToken: req.csrfToken(),
          errorExist: messages.length > 0,
          loginErrors: messages,
          userEvents: events,
          fromDate: from,
          toDate: to,
        });
      });
    }
    // login page
    else {
      res.render('index', {
        title: 'TeamUp - Login or Sign Up',
        csrfToken: req.csrfToken(),
        errorExist: messages.length > 0,
        loginErrors: messages,
      });
    }
    return;
  });

module.exports = router;
