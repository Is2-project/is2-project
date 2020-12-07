const express = require('express');

const books = require('./books');
const users = require('./users');
const review = require('./reviews');
const auth = require('./authentication');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
app.get('/profile', function(req, res) { res.render('pages/profile'); });
app.get('/aggiungiLibro', function(req, res) { res.render('pages/aggiungiLibro'); });
app.get('/libro', function(req, res) { res.render('pages/libro'); });
app.get('/aggiungiRecensione', function(req, res) { res.render('pages/aggiungiRecensione'); });
app.use(express.static('views/pages'))



/* Default 404 handler */
app.use((req, res) => {
    res.status(404);
    res.render('pages/error404');
});

//necessario per poter usare 'app' in server.js
module.exports = app;
