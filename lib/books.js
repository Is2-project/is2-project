const express = require('express');
const router = express.Router();
const db = require('./db.js');

//function that search if there are some input from users
function findParam(param){
    for(let item in param) {
        if(param[item]!==undefined){
            return true;
        }
    }
    return false;
}

//get all the books
router.get('/api/books', (req, res) => { 
    //user parameters
    let userParam = {
        title: req.query.title,
        author: req.query.author,
        genre: req.query.genre,
        from_year: req.query.from_year,
        to_year: req.query.to_year,
        from_rating:req.query.from_rating
        //to_rating: req.query.to_rating,
    };
    if(findParam(userParam)){
        res.status(200).json(db.books.getBooks(userParam));
        console.log("eseguita GET /api/book con parametri");
    }
    else {
        res.status(200).json(db.books.all());
        console.log("eseguita GET /api/book senza parametri");
    } 
});

/* POST /api/books */
router.post('/api/books', (req, res) => {
    //book parameters
    let userParam = {
        isbn: req.body.isbn,
        title: req.body.title,
        author: req.body.author,
        genre: req.body.genre,
        year: parseInt(req.body.year),
        rating: null
    };
    
    let bookIsbn = db.books.insert(userParam);

    res.location("/api/books/" + bookIsbn).status(201).send();
    console.log("eseguita POST /api/book");
});

/* GET /api/books/:isbn */
router.get('/api/books/:isbn', (req, res) => {
    let book = db.books.findByIsbn(req.params.isbn);
    book.self = `/api/books/${book.isbn}`;
    res.status(200).json(book);
    console.log("eseguita GET /api/book/isbn");
});


module.exports = router;