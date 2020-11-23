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

    let books;

    if(findParam(userParam)){
        books = db.books.getBooks(userParam);
        console.log("eseguita GET /api/book con parametri");
    }
    else {
        books = db.books.all();
        console.log("eseguita GET /api/book senza parametri");
    } 

    res.status(200).json(books.map((book) => {
        return {
            self: `/api/books/${book.isbn}`,
            isbn: book.isbn,
            title: book.title,
            author: book.author,
            year: book.year,
            genre: book.genre,
            rating: db.reviews.getBookRating(book.isbn)
        }
    }));
});

/* POST /api/books */
router.post('/api/books', (req, res) => {
    //book parameters
    let userParam = {
        isbn: req.body.isbn,
        title: req.body.title,
        author: req.body.author,
        genre: req.body.genre,
        year: parseInt(req.body.year)
    };
    
    let bookIsbn = db.books.insert(userParam);

    res.location("/api/books/" + bookIsbn).status(201).send();
    console.log("eseguita POST /api/book");
});

/* GET /api/books/:isbn */
router.get('/api/books/:isbn', (req, res) => {
    let book = db.books.findByIsbn(req.params.isbn);
    if(book !== undefined) {
        res.status(200).json({
            self: `/api/books/${book.isbn}`,
            isbn: book.isbn,
            title: book.title,
            author: book.author,
            year: book.year,
            genre: book.genre,
            rating: db.reviews.getBookRating(book.isbn)
        });
    } else {
        res.status(404).json({error: "Book was not found"});
    }
    
    console.log("eseguita GET /api/book/isbn");
});


module.exports = router;