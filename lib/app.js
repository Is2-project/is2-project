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

/* Static frontend files */
var options = {
  index: "libri.html"
};
app.use('/', express.static('static', options));


/* Default 404 handler */
app.use((req, res) => {
    res.status(404);
    res.json({ error: 'Not found' });
});

//necessario per poter usare 'app' in server.js
module.exports = app;
