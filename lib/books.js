const express = require('express');
const router = express.Router();
const db = require('./db.js');

//function that search uf there are some input from users
function findParam(param){
    for(let item in param) {
        if(typeof(param.item)!==undefined)
            return true;
    }
    return false;
}

//get all the books
router.get('', (req, res) => { 
    //user parameters
    let userParam = {
        title: req.query.title,
        author: req.query.author,
        genre: req.query.genre,
        from_year: req.query.from_year,
        to_year: req.query.to_year,
        from_rating:req.query.from_rating,
        to_rating: req.query.to_rating,
    };
    if(findParam(userParam))
        res.status(200).json(db.books.getBooks(userParam));
    else {
        res.status(200).json(db.books.all()); //giusto 100%
    } 
});

router.get('/:isbn', (req, res) => {
    let book = db.books.findByIsbn(req.params.isbn);
    res.status(200).json(book);
});

module.exports = router;