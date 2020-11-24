const express = require('express');
const router = express.Router();
const db = require('./db');

/* GET /api/books/{isbn}/reviews */
router.get("/api/books/:isbn/reviews", (req, res) => {

    let isbn = req.params.isbn;

    //check if user with id == id does exist and get it from database
    const book = db.books.findByIsbn(isbn);
    if(book === undefined) {
        res.status(404).json({ error: "Book could not be found" });
        return;
    }

    res.status(200).json(db.reviews.findByBook(isbn).map((review) => {
        return {
            self: `/api/reviews/${review.id}`,
            id: review.id,
            description: review.description,
            rating: review.rating,
            book: review.book,
            user: review.user
        };
    }));

});


/* POST /api/books/{isbn}/reviews */
router.post('/api/books/:isbn/reviews', (req, res) => {

    if(req.logged === true) {

        const isbn = req.params.isbn;

        //check if the review's book exists
        const book = db.books.findByIsbn(isbn);
        if(book === undefined) {
            //book does not exit
            res.status(404).json({ error: "Book was not found" });
            return;
        }

        try {

            //review parameters
            let review = {
                description: req.body.description,
                rating: parseInt(req.body.rating),
                book: isbn,
                user: req.loggedUser.id
            };

            if(review.rating < 0) {
                review.rating = 0;
            }

            if(review.rating > 5) {
                review.rating = 5;
            }

            const id = db.reviews.insert(review);
            res.location("/api/review/" + id).status(201).send();

        } catch (error) {
            res.status(400).json({ error: "Invalid rating" });
            return;
        }

    } else {
        res.status(401).json({ error: "Not logged in." });
    }

});

/* Gets all the reviews made by a user */
router.get("/api/users/:id/reviews", (req, res) => {

    let id = req.params.id;

    try {
        id = parseInt(id);
    } catch(error) {
        res.status(400).json({ error: "id is invalid or missing." });
        return;
    }

    //check if user with id == id does exist and get it from database
    const user = db.users.get(id);
    if(id === null) {
        res.status(404).json({ error: "User could not found" });
        return;
    }

    res.status(200).json(db.reviews.findByUser(id).map((review) => {
        return {
            self: `/api/reviews/${review.id}`,
            id: review.id,
            description: review.description,
            rating: review.rating,
            book: review.book,
            user: review.user
        };
    }));

});

/* GET /api/review/id */
router.get('/api/reviews/:id', (req, res) => {

    try {

        const review = db.reviews.findReviewById(parseInt(req.params.id));

        if(review !== undefined) {
            res.status(200).json({
                self: `/api/reviews/${review.id}`,
                id: review.id,
                description: review.description,
                rating: review.rating,
                book: review.book,
                user: review.user
            });
        } else {
            res.status(404).json({error: "Review was not found"});
        }

    } catch (error) {

        res.status(400).json({error: "Inavlid id"});

    }



});

/* DELETE /api/reviews/id */
router.delete('/api/reviews/:id', (req, res) => {

    if(req.logged == true) {

        const user = req.loggedUser;

        try {

            const review = db.reviews.findReviewById(parseInt(req.params.id));

            if(review !== undefined) {
                if(review.user === user.id) {
                    db.reviews.delete(review.id);
                    res.sendStatus(200);
                } else {
                    res.status(401).json({error: "You can't delete someone else's reviews"});
                }
            } else {
                res.status(404).json({error: "Review was not found"});
            }


        } catch (error) {

            res.status(400).json({error: "Inavlid id"});

        }

    } else {
        res.status(401).json({ error: "Not logged in" });
    }

});

/* PUT /api/reviews/id */
router.put('/api/reviews/:id', (req, res) => {

    if(req.logged == true) {

        const user = req.loggedUser;

        try {

            const review = db.reviews.findReviewById(parseInt(req.params.id));

            if(review !== undefined) {
                if(review.user === user.id) {

                    const description = req.body.description;
                    const rating = req.body.rating;

                    if(description !== null && description !== undefined) {
                        review.description = description;
                    }

                    if(rating !== null && rating !== undefined) {
                        try {
                            review.rating = parseInt(rating);

                            if(review.rating < 0) {
                                review.rating = 0;
                            }

                            if(review.rating > 5) {
                                review.rating = 5;
                            }
                        } catch (error) {
                            res.status(400).json({error: "Invalid rating"});
                            return;
                        }
                    }

                    db.reviews.update(review);
                    res.sendStatus(200);
                } else {
                    res.status(401).json({error: "You can't update someone else's reviews"});
                }
            } else {
                res.status(404).json({error: "Review was not found"});
            }


        } catch (error) {
            console.log(error);
            res.status(400).json({error: "Inavlid id"});

        }

    } else {
        res.status(401).json({ error: "Not logged in" });
    }

})

module.exports = router;
