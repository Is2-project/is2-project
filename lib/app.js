const express = require('express');
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


//provafunzionamento server
app.get('/prova', function(req, res){ 
    res.send('prova!');
});

/* Default 404 handler */
app.use((req, res) => {
    res.status(404);
    res.json({ error: 'Not found' });
});


//necessario per poter usare 'app' in server.js
module.exports = app;