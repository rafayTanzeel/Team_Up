'use strict';

const express = require('express');
const router = new express.Router();
const nconf = require('nconf');
const Event = require('../models/Event');
const xssFilters = require('xss-filters');
const moment = require('moment');

/* GET Event Room page */
router.route('/chatroom/:id')
  .get((req, res, next) => {
    const id = req.params.id;
    const userId = req.user._id;

    Event.findOne({'aliasId': id}).exec((err, event) => {
      if (err || event == null) {
        res.status(404).render('notFound', {
          title: 'Page Not Found',
        });
      } else {
        // Check if user belongs to the event
        let isEventMember = validateEventMember(event, userId);

        // Check if user is unauthorized to view page
        if (isEventMember == false) {
          // Send unauthorized page (403 error)
          res.status(404).render('notAuthorized', {
            title: 'No Permission',
          });
        } else {
          let fromDate = moment(event.from).format('ddd DD MMM YYYY hh:mm A');
          let toDate = moment(event.to).format('ddd DD MMM YYYY hh:mm A');
          res.render('event', {csrfToken: req.csrfToken(), title: event.teamupName,
            event: event, fromDate: fromDate, toDate: toDate, mapKey: nconf.get('googleMap:key')});
        }
      }
    });


    return;
  });

/* Process Edit */
router.route('/edit/:id')
  .post((req, res, next) => {
    const id = req.params.id;
    const userId = req.user._id;

    Event.findOne({'aliasId': id}).exec((err, event) => {
      if (err || event == null) {
        res.json({
          msg: 'Error!',
          text: 'Not Found',
          status: 404, redirect: '/notFound',
        });
      } else {
        // Check if user is the owner of the event
        let isCreator = validateEventCreator(event, userId);

        // Check if user is unauthorized to process
        if (isCreator == false) {
          // Send unauthorized page (403 error)
          res.json({
            msg: 'Error!',
            text: 'You have not authorized to perform this action',
            status: 403, redirect: '/',
          });
        } else {
          event.teamupName = xssFilters.inHTMLData(req.body.teamupName);
          event.from = xssFilters.inHTMLData(req.body.from);
          event.to = xssFilters.inHTMLData(req.body.to);

          if (event.users.length > req.body.maxPlayers) {
            event.maxPlayers = event.users.length;
          } else {
            event.maxPlayers = xssFilters.inHTMLData(req.body.maxPlayers);
          }

          event.save((err) => {
            if (err) throw err;
          });

          res.json({
            msg: 'Event Updated!',
            text: event.teamupName + ' has been successfully updated',
            status: 204, redirect: '/',
          });
        }
      }
    });


    return;
  });

/* Process Leave */
router.route('/leave/:id')
  .post((req, res, next) => {
    const id = req.params.id;
    const userId = req.user._id;

    Event.findOne({'aliasId': id}).exec((err, event) => {
      if (err || event == null) {
        res.json({
          msg: 'Error!',
          text: 'Not Found',
          status: 404, redirect: '/notFound',
        });
      } else {
        // Check if user belongs to the event
        let isEventMember = validateEventMember(event, userId);

        // Check if user is unauthorized to process
        if (isEventMember == false) {
          // Send unauthorized page (403 error)
          res.json({
            msg: 'Error!',
            text: 'You have not authorized to perform this action',
            status: 403, redirect: '/',
          });
        } else {
          event.users.pull(req.user._id);

          event.save((err) => {
            if (err) throw err;
          });

          res.json({
            msg: 'Updated!',
            text: 'You have been removed from ' + event.teamupName,
            status: 204, redirect: '/',
          });
        }
      }
    });


    return;
  });

/* Process delete */
router.route('/delete/:id')
  .post((req, res, next) => {
    const id = req.params.id;
    const userId = req.user._id;

    Event.findOne({'aliasId': id}).exec((err, event) => {
      if (err || event == null) {
        res.json({
          msg: 'Error!',
          text: 'Not Found',
          status: 404, redirect: '/notFound',
        });
      } else {
        // Check if user belongs to the event
        let isCreator = validateEventCreator(event, userId);

        // Check if user is unauthorized to process
        if (isCreator == false) {
          // Send unauthorized page (403 error)
          res.json({
            msg: 'Error!',
            text: 'You have not authorized to perform this action',
            status: 403, redirect: '/',
          });
        } else {
          let resText = event.teamupName + ' has been successfully deleted.';
          event.remove();

          res.json({
            msg: 'Deleted!',
            text: resText,
            status: 204, redirect: '/',
          });
        }
      }
    });

    return;
  });

function validateEventMember(event, userId) {
  let isJoined = event.users.filter((value) => {
 return value.toString() == userId;
});
  let retVal;

  // Check if user belongs to the event
  if (isJoined.length <= 0) {
    retVal = false;
  } else {
    retVal = true;
  }
  return retVal;
}

function validateEventCreator(event, userId) {
  let retVal;

  // Check if user is the creator of the event
  if (event.createdBy.toString() != userId) {
    retVal = false;
  } else {
    retVal = true;
  }
  return retVal;
}

module.exports = router;
