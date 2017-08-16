'use strict';

const express = require('express');
const Event = require('../models/Event');
const xssFilters = require('xss-filters');
const nconf = require('nconf');
const router = new express.Router();

/* GET create event page */
router.route('/').get((req, res) => {
  res.render('create', {
    title: 'Create Events',
    mapKey: nconf.get('googleMap:key'),
    csrfToken: req.csrfToken(),
  });
});

/* POST create event */
router.route('/').post((req, res) => {
  const teamupName = xssFilters.inHTMLData(req.body.teamupName);
  const from = xssFilters.inHTMLData(req.body.from);
  const to = xssFilters.inHTMLData(req.body.to);
  const sport = xssFilters.inHTMLData(req.body.sport);
  const maxPlayers = xssFilters.inHTMLData(req.body.maxPlayers);
  const locationName = xssFilters.inHTMLData(req.body.locationName);
  const locationAddress = xssFilters.inHTMLData(req.body.locationAddress);
  const locationCoordinates = xssFilters.inHTMLData(req.body.loc);
  const userId = xssFilters.inHTMLData(req.user._id);

  const event = new Event({
    teamupName: teamupName,
    from: from,
    to: to,
    sport: sport,
    maxPlayers: maxPlayers,
    locationName: locationName,
    locationAddress: locationAddress,
    locationCoordinates: JSON.parse(locationCoordinates),
    createdBy: userId,
  });

  event.users.push(userId);
  event.save((err, event) => {
    if (err) throw err;
    // console.log('Created: ' + event.aliasId);
    res.redirect('/');
  });
});

module.exports = router;
