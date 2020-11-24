const express = require('express');
const db = require('./db');
const cookieParser = require('cookie-parser');

const books = require('./books');
const users = require('./users');
const review = require('./reviews');
const auth = require('./authentication');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

/* AUTHENTICATION */
app.use(auth);

/* API */
app.use(books);
app.use(review);
app.use(users);

/* Frontend static and dynamic files */
app.set('view engine', 'ejs'); // set the view engine to ejs
app.get('/', function(req, res) { res.render('pages/index'); });
app.get('/signin', function(req, res) { res.render('pages/signin'); });
app.get('/signup', function(req, res) { res.render('pages/signup'); });
app.get('/user', function(req, res) { res.render('pages/user'); });
app.use(express.static('views/pages'))



/* Default 404 handler */
app.use((req, res) => {
    res.status(404);
    res.json({ error: 'Not found' });
});

//necessario per poter usare 'app' in server.js
module.exports = app;
