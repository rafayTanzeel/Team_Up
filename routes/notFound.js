'use strict';

const express = require('express');
const router = new express.Router();

/* GET 404 page */
router.route('*')
  .get((req, res, next) => {
    res.status(404).render('notFound', {
      title: 'Page Not Found',
    });
  });
module.exports = router;
