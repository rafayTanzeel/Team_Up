'use strict';

const path = require('path');
const express = require('express');
const favicon = require('serve-favicon');
const helmet = require('helmet');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const csrf = require('csurf');
const expressValidator = require('express-validator');
const nconf = require('./src/config/nconfConfig');
const mongoose = require('mongoose');
const multer = require('multer');

// Routes Config
const index = require('./routes/index');
const auth = require('./routes/auth');
const notFound = require('./routes/notFound');
const contactUs = require('./routes/contactUs');
const sports = require('./routes/sports');
const about = require('./routes/about');
const create = require('./routes/create');
const event = require('./routes/event');
const edit = require('./routes/edit');
const join = require('./routes/join');

// Server Config
const serverConfig = express();
mongoose.connect(process.env.MONGODB_URI);

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'mongodb connection error:'));
// const dbConnection = mongoose.createConnection('mongodb://localhost/users');

// favicon icon
serverConfig.use(favicon(path.join(__dirname, 'public', 'assets', 'images', 'raster', 'ico', 'favicon.ico')));

// Secure http headers configured
serverConfig.use(helmet());
// serverConfig.use(helmet.contentSecurityPolicy({
//   directives: {
//     defaultSrc: ["'self'", 'default.com'],
//     styleSrc: ["'self'", 'maxcdn.bootstrapcdn.com'],
//     imgSrc: ['img.com', 'data:'],
//     sandbox: ['allow-forms', 'allow-scripts'],
//     reportUri: '/report-violation',
//     objectSrc: [], // An empty array allows nothing through
//   },
// }));


serverConfig.use(bodyParser.json());
serverConfig.use(bodyParser.urlencoded({
  extended: false, // body only accept string or array
}));
serverConfig.use(expressValidator());
serverConfig.use(cookieParser());

serverConfig.use(multer({
  dest: './public/uploads/',
}).single('pic_upload'));

serverConfig.use(csrf({
  cookie: true,
}));

// handle bad CSRF token
serverConfig.use((err, req, res, next) => {
  if (err.code !== 'EBADCSRFTOKEN') return next(err);
  res.status(403);
  res.send('Form Exploited');
});

// Session and Cookie configuration
serverConfig.use(session({
  name: 'teamId',
  store: new MongoStore({
    mongooseConnection: mongoose.connection,
    ttl: 1 * 60 * 60, // = 1 hr
  }),
  secret: nconf.get('session:secret'),
  resave: false,
  saveUninitialized: false,
  cookie: {
    path: '/',
    httpOnly: true,
    // secure: true,
    maxAge: 1 * 60 * 60 * 1000, // = 1 hr
  },
  // store: new MongoStore({
  //   mongooseConnection: dbConnection,
  // }),
}));
serverConfig.use(flash());

// Import authentication strategies
require('./src/config/authConfig')(serverConfig);

// Setting up Engine Config
serverConfig.set('views', path.join(__dirname, 'views'));
serverConfig.set('view engine', 'pug');

// Setting up Routes
serverConfig.use(express.static(path.join(__dirname, 'public')));


serverConfig.use('/', index);
serverConfig.use('/auth', auth);

serverConfig.use((req, res, next) => {
  if (!req.isAuthenticated()) {
    return res.redirect('/');
  }
  next();
});

// put your routes here
// only thing you need to put here is:
// const yourRoute = require('./routes/yourRoute');
// serverConfig.use('/theRouteYouWantToAttachTo', yourRoute);
// <-- Start Here

serverConfig.use('/contact', contactUs);
serverConfig.use('/sports', sports);
serverConfig.use('/about', about);
serverConfig.use('/create', create);
serverConfig.use('/event', event);
serverConfig.use('/edit', edit);
serverConfig.use('/join', join);

// --> End Here

// 404 route
serverConfig.use('/', notFound);

module.exports = serverConfig;
