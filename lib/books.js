const express = require('express');
const { all } = require('./app.js');
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
        year:  req.body.year
    };

    try{
        userParam.year = parseInt(req.body.year);
    }catch (error) {
        res.status(400).json({ error: "Error: rating must be an integer" });
        return;
    }

    //check if if the review's genre exists
    let allGenre = ["horror","fantascienza","documentario","azione","biografico","comico","commedia","thriller"];
    let existGenre = allGenre.findIndex((genre) => genre === userParam.genre);
    if(existGenre < 0){
        res.status(400).json({ error: "Error: your genre doesn't exist" });
        return;
    }

    //check if the review's book exists
    const book = db.books.existBook(reviewParam.title);
    if(book === null) {
        //book does not exit
        res.status(400).json({ error: "Error: The book of the review doesn't exist" });
        return;
    }

    //find a user with this email address
    const user = db.users.getByEmail(req.param.email);
    if(user === null) {
        //user is not logged in
        res.status(401).json({ error: "Error: Unauthorized" });
        return;
    }
    userParam.user = user.id;

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