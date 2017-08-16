'use strict';

const express = require('express');
const router = new express.Router();

/* GET about page */
router.route('/').get((req, res) => {
  res.render('about', {
    title: 'About Us',
    csrfToken: req.csrfToken(),
  });
});

module.exports = router;
