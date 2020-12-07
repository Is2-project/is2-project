const express = require('express');
const router = express.Router();
const Review = require('./models/review');
const Book = require('./models/book');
const User = require('./models/user');

/* GET /api/books/{isbn}/reviews */
router.get("/api/books/:isbn/reviews", async (req, res) => {

    let isbn = req.params.isbn;

    try {
        //check if user with id == id does exist and get it from database
        const book = await Book.findOne({ isbn: isbn }).exec();
        if(book) {

            try {

                const reviews = await Review.find({ book: isbn }).exec();

                res.status(200).json(reviews.map((review) => {
                    return {
                        self: `/api/reviews/${review._id}`,
                        id: review._id,
                        description: review.description,
                        rating: review.rating,
                        book: review.book,
                        user: review.user
                    };
                }));

            } catch (e) {
                res.status(500).json({error: "Database error", message: e});
            }

        } else {
            res.status(404).json({ error: "Book could not be found" });
        }
    } catch (e) {
        res.status(500).json({error: "Database error", message: e});
    }



});


/* POST /api/books/{isbn}/reviews */
router.post('/api/books/:isbn/reviews', async (req, res) => {

    if(req.logged === true) {

        const isbn = req.params.isbn;

        try {
            //check if the review's book exists
            const book = await Book.findOne({ isbn: isbn }).exec();
            if(book) {

                try {

                    if(await Review.findOne({ book: req.params.isbn, user: req.loggedUser._id }).exec()) {

                        res.status(400).json({ error: "You already created a review for this book" });

                    } else {

                        try {

                            //review parameters
                            const review = new Review({
                                description: req.body.description,
                                rating: Math.min(5, Math.max(0, parseInt(req.body.rating))),
                                book: isbn,
                                user: req.loggedUser._id
                            });

                            try {

                                await review.save();
                                res.location("/api/reviews/" + review._id).status(201).send();

                            } catch (e) {
                                res.status(500).json({error: "Database error", message: e});
                            }

                        } catch (error) {
                            res.status(400).json({ error: "Invalid rating" });
                            return;
                        }

                    }

                } catch (error) {
                    res.status(400).json({ error: "Invalid rating" });
                    return;
                }

            } else {

                //book does not exit
                res.status(404).json({ error: "Book was not found" });

            }
        } catch (e) {
            res.status(500).json({error: "Database error", message: e});
        }

    } else {
        res.status(401).json({ error: "Not logged in." });
    }

});

/* Gets all the reviews made by a user */
router.get("/api/users/:id/reviews", async (req, res) => {

    const id = req.params.id;

    try {

        //check if user with id == id does exist and get it from database
        const user = await User.findById(id).exec();
        if(user) {

            try {

                const reviews = await Review.find({user: id}).exec();

                res.status(200).json(reviews.map((review) => {
                    return {
                        self: `/api/reviews/${review._id}`,
                        id: review._id,
                        description: review.description,
                        rating: review.rating,
                        book: review.book,
                        user: review.user
                    };
                }));

            } catch (e) {
                res.status(500).json({error: "Database error", message: e});
            }

        } else {

            res.status(404).json({ error: "User could not found" });

        }



    } catch (e) {
        res.status(500).json({error: "Database error", message: e});
    }

});

/* GET /api/review/id */
router.get('/api/reviews/:id', async (req, res) => {

    try {

        const review = await Review.findById(req.params.id).exec();

        if(review) {

            res.status(200).json({
                self: `/api/reviews/${review._id}`,
                id: review._id,
                description: review.description,
                rating: review.rating,
                book: review.book,
                user: review.user
            });

        } else {
            res.status(404).json({error: "Review was not found"});
        }

    } catch (e) {
        res.status(500).json({error: "Database error", message: e});
    }



});

/* DELETE /api/reviews/id */
router.delete('/api/reviews/:id', async (req, res) => {

    if(req.logged == true) {

        const user = req.loggedUser;

        try {

            const review = await Review.findById(req.params.id).exec();

            if(review) {

                if(review.user.equals(user._id)) {

                    try {

                        await review.deleteOne();
                        res.sendStatus(200);

                    } catch (e) {
                        res.status(500).json({error: "Database error", message: e});
                    }


                } else {
                    res.status(401).json({error: "You can't delete someone else's reviews"});
                }

            } else {
                res.status(404).json({error: "Review was not found"});
            }


        } catch (e) {
            res.status(500).json({error: "Database error", message: e});
        }

    } else {
        res.status(401).json({ error: "Not logged in" });
    }

});

/* PUT /api/reviews/id */
router.put('/api/reviews/:id', async (req, res) => {

    if(req.logged == true) {

        const user = req.loggedUser;

        try {

            const review = await Review.findById(req.params.id).exec();

            if(review) {

                if(review.user.equals(user._id)) {

                    const description = req.body.description;
                    const rating = req.body.rating;

                    if(description !== null && description !== undefined) {
                        review.description = description;
                    }

                    if(rating !== null && rating !== undefined) {
                        try {

                            review.rating = Math.min(5, Math.max(0, parseInt(req.body.rating)))

                        } catch (error) {

                            res.status(400).json({error: "Invalid rating"});
                            return;

                        }
                    }

                    try {

                        await review.save();
                        res.sendStatus(200);

                    } catch (e) {
                        res.status(500).json({error: "Database error", message: e});
                    }

                } else {
                    res.status(401).json({error: "You can't update someone else's reviews"});
                }
            } else {
                res.status(404).json({error: "Review was not found"});
            }


        } catch (e) {
            res.status(500).json({error: "Database error", message: e});
        }

    } else {
        res.status(401).json({ error: "Not logged in" });
    }

})

module.exports = router;
