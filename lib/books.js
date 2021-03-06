const express = require('express');
const router = express.Router();
const Book = require('./models/book');

const GENRES = ["horror", "fantascienza", "documentario", "azione", "biografico", "comico", "commedia", "thriller","storico","avventura","per ragazzi","giallo","psicologico","umoristico"];

//get all the books
router.get('/api/books', async (req, res) => {
    //user parameters

    let query = {
        title: { $regex: `.*${req.query.title ?? ""}.*`, $options: "i" },
        author: { $regex: `.*${req.query.author ?? ""}.*`, $options: "i" },
        genre: { $regex: `.*${req.query.genre ?? ""}.*`, $options: "i" },
    };

    if(req.query.from_year) {
        query.year = { $gte: req.query.from_year }
    }

    if(req.query.to_year) {
        if(query.year) {
            query.year.$lte = req.query.to_year
        } else {
            query.year = { $lte: req.query.to_year }
        }
    }

    try {
        const rating = parseInt(req.query.from_rating);

        try {
            let books = await Book.find(query).exec();

            res.status(200).json((await Promise.all(books.map(async (book) => {
                return {
                    self: `/api/books/${book.isbn}`,
                    isbn: book.isbn,
                    title: book.title,
                    author: book.author,
                    year: book.year,
                    genre: book.genre,
                    user: book.user,
                    rating: await book.rating()
                }
            }))).filter(book => !req.query.from_rating || book.rating >= rating));
        } catch (e) {
            res.status(500).json({error: "Database error", message: e});
        }
    } catch (e) {
        res.status(400).json({error: "Invalid rating"});
    }


});

/* POST /api/books */
router.post('/api/books', async (req, res) => {

    if(req.logged) {

        try {

            if(await Book.findOne({ isbn: req.body.isbn }).exec()) {
                res.status(400).json({ error: "A book with this isbn already exists" });
                return;
            }

            if(!GENRES.includes(req.body.genre)) {
                res.status(400).json({ error: "Invalid genre, see valid genres attached", genres: GENRES });
                return;
            }

            try{

                const year = parseInt(req.body.year);
                if(!isNaN(year)) {

                    const book = new Book({
                        isbn: req.body.isbn,
                        title: req.body.title,
                        author: req.body.author,
                        genre: req.body.genre,
                        year: year,
                        user: req.loggedUser._id
                    });

                    try {

                        await book.save();
                        res.location("/api/books/" + book.isbn).status(201).send();

                    } catch (e) {
                        res.status(500).json({error: "Database error", message: e});
                    }

                } else {
                    res.status(400).json({ error: "Year must be an integer" });
                }
            } catch (error) {
                res.status(400).json({ error: "Year must be an integer" });
            }
        } catch (e) {
            res.status(500).json({error: "Database error", message: e});
        }

    } else {
        res.status(401).json({ error: "Not logged in" });
    }

});

/* GET /api/books/:isbn */
router.get('/api/books/:isbn', async (req, res) => {

    try {

        const book = await Book.findOne({ isbn: req.params.isbn }).exec();

        if(book) {
            res.status(200).json({
                self: `/api/books/${book.isbn}`,
                isbn: book.isbn,
                title: book.title,
                author: book.author,
                year: book.year,
                genre: book.genre,
                user: book.user,
                rating: await book.rating()
            });
        } else {
            res.status(404).json({error: "Book was not found"});
        }
    } catch (e) {
        res.status(500).json({error: "Database error", message: e});
    }

});


module.exports = router;
