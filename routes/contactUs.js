'use strict';

const express = require('express');
const xssFilters = require('xss-filters');
const router = new express.Router();
const nodemailer = require('nodemailer');


router.route('/')
  .post((req, res, next) => {
    // extract data
    const contactName = xssFilters.inHTMLData(req.body.contactName);
    const contactEmail = xssFilters.inHTMLData(req.body.contactEmail);
    const contactLocation = xssFilters.inHTMLData(req.body.contactLocation);
    const contactMsg = xssFilters.inHTMLData(req.body.contactMsg);

    const subject = 'TeamUp - Feedback';
    const sender = '\"' + contactName + '\" <' + contactEmail + '>';

    let textBody = 'Contact Name: ' + contactName + '<br/>' +
                    'Contact Email: ' + contactEmail + '<br/>' +
                    'Contact Location: ' + contactLocation +
                    '<br/><br/><br/>' +
                    '<b>Message</b>:  ' + contactMsg + '<br/>';


    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'teamUp.robot@gmail.com',
            pass: 'letsplay',
        },
    });
    // setup email data with unicode symbols
    let mailOptions = {
        from: '\'' + sender + '\'',
        to: 'rafaytanzeel@gmail.com',
        subject: subject,
        html: textBody,
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message %s sent: %s', info.messageId, info.response);
    });

    res.redirect('/');
    return;
  });

module.exports = router;
