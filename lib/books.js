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
    }
    else {
        books = db.books.all();
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

    if(req.logged) {

        //book parameters
        let userParam = {
            isbn: req.body.isbn,
            title: req.body.title,
            author: req.body.author,
            genre: req.body.genre,
            year:  req.body.year,
            user: req.loggedUser.id
        };

        try{
            userParam.year = parseInt(req.body.year);
        }catch (error) {
            res.status(400).json({ error: "Error: year must be an integer" });
            return;
        }

        //check if if the review's genre exists
        let allGenre = ["horror","fantascienza","documentario","azione","biografico","comico","commedia","thriller"];
        let existGenre = allGenre.findIndex((genre) => genre === userParam.genre); // STA ROBA NON SERVE SI FA IL CONTROLLO CON L'HTML
        if(existGenre < 0){
            res.status(400).json({ error: "Error: your genre doesn't exist" });
            return;
        }

        //check if the review's book exists
        const book = db.books.findByIsbn(userParam.isbn);
        if(book === null) {
            //book does not exit
            res.status(400).json({ error: "Error: The book of the review doesn't exist" });
            return;
        }

        let bookIsbn = db.books.insert(userParam);
        res.location("/api/books/" + bookIsbn).status(201).send();

    } else {
        res.status(401).json({ error: "Not logged in" });
    }

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

});


module.exports = router;
