const express = require('express');
const db = require('./db');

const books = require('./books');
const users = require('./users');
const review = require('./reviews');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* API */
app.use(books);
app.use(review);
app.use(users);


/* Default 404 handler */
app.use((req, res) => {
    res.status(404);
    res.json({ error: 'Not found' });
});

//necessario per poter usare 'app' in server.js
module.exports = app;