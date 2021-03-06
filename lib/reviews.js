const express = require('express');
const router = express.Router();
const Review = require('./models/review');
const Book = require('./models/book');
const User = require('./models/user');
const user = require('./models/user');

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
                        user: review.user,
                        date: review.date,
                        likes: review.likes.length,
                        dislikes: review.dislikes.length
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
                                user: req.loggedUser._id,
                                date: Date(),
                                likes: [],
                                dislikes: []
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
                        user: review.user,
                        date: review.date,
                        likes: review.likes.length,
                        dislikes: review.dislikes.length
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
                user: review.user,
                date: review.date,
                likes: review.likes.length,
                dislikes: review.dislikes.length
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

                        /** DO NOT AWAIT THIS */
                        updateUserProgress(review.user);

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

});

/* GET /api/reviews/id/like */
router.get('/api/reviews/:id/like', async (req, res) => {
    if(req.logged) {

        const userid = req.loggedUser._id.toString();

        try {

            const review = await Review.findById(req.params.id).exec();

            if(review) {

                res.status(200).json({like: review.likes.includes(userid)});

            } else {
                res.status(404).json({error: "Review was not found"});
            }

        } catch (e) {
            res.status(500).json({error: "Database error", message: e});
        }

    } else {
        res.status(401).json({error: "Not logged in"});
    }
});

/* GET /api/reviews/id/dislike */
router.get('/api/reviews/:id/dislike', async (req, res) => {
    if(req.logged) {

        const userid = req.loggedUser._id.toString();

        try {

            const review = await Review.findById(req.params.id).exec();

            if(review) {

                res.status(200).json({dislike: review.dislikes.includes(userid)});

            } else {
                res.status(404).json({error: "Review was not found"});
            }

        } catch (e) {
            res.status(500).json({error: "Database error", message: e});
        }

    } else {
        res.status(401).json({error: "Not logged in"});
    }
});

/* POST /api/reviews/id/like */
router.post('/api/reviews/:id/like', async (req, res) => {
    if(req.logged) {

        const userid = req.loggedUser._id;

        try {

            const review = await Review.findById(req.params.id).exec();

            if(review) {

                if(review.user.equals(userid)) {
                    res.status(400).json({error: "You can't like your own review"});
                } else {

                    try {

                        await Review.updateOne({_id: review._id}, {
                            $addToSet: {
                                likes: userid
                            },
                            $pull: {
                                dislikes: userid
                            }
                        });

                        /** DO NOT AWAIT THIS */
                        updateUserProgress(review.user);
    
                        res.sendStatus(200);
                    } catch (e) {
                        res.status(500).json({error: "Database error", message: e});
                    }

                }

            } else {

                res.status(404).json({error: "Review was not found"});

            }

        } catch (e) {
            res.status(500).json({error: "Database error", message: e});
        }

    } else {
        res.status(401).json({error: "Not logged in"});
    }
});

/* POST /api/reviews/id/dislike */
router.post('/api/reviews/:id/dislike', async (req, res) => {
    if(req.logged) {

        const userid = req.loggedUser._id;

        try {

            const review = await Review.findById(req.params.id).exec();

            if(review) {

                if(review.user.equals(userid)) {
                    res.status(400).json({error: "You can't dislike your own review"});
                } else {

                    try {

                        await Review.updateOne({_id: review._id}, {
                            $addToSet: {
                                dislikes: userid
                            },
                            $pull: {
                                likes: userid
                            }
                        });

                        /** DO NOT AWAIT THIS */
                        updateUserProgress(review.user);
    
                        res.sendStatus(200);
                    } catch (e) {
                        res.status(500).json({error: "Database error", message: e});
                    }

                }

            } else {
                res.status(404).json({error: "Review was not found"});
            }


        } catch (e) {
            res.status(500).json({error: "Database error", message: e});
        }

    } else {
        res.status(401).json({error: "Not logged in"});
    }
});

/* DELETE /api/reviews/id/like */
router.delete('/api/reviews/:id/like', async (req, res) => {
    if(req.logged) {

        const userid = req.loggedUser._id;

        try {

            const review = await Review.findById(req.params.id).exec();

            if(review) {

                try {

                    await review.update({
                        $pull: {
                            likes: userid
                        }
                    });

                    /** DO NOT AWAIT THIS */
                    updateUserProgress(review.user);

                    res.sendStatus(200);
                } catch (e) {
                    res.status(500).json({error: "Database error", message: e});
                }

            } else {
                res.status(404).json({error: "Review was not found"});
            }

        } catch (e) {
            res.status(500).json({error: "Database error", message: e});
        }

    } else {
        res.status(401).json({error: "Not logged in"});
    }
});

/* DELETE /api/reviews/id/dislike */
router.delete('/api/reviews/:id/dislike', async (req, res) => {
    if(req.logged) {

        const userid = req.loggedUser._id;

        try {

            const review = await Review.findById(req.params.id).exec();

            if(review) {

                try {

                    await review.update({
                        $pull: {
                            dislikes: userid
                        }
                    });

                    /** DO NOT AWAIT THIS */
                    updateUserProgress(review.user);

                    res.sendStatus(200);
                } catch (e) {
                    res.status(500).json({error: "Database error", message: e});
                }

            } else {
                res.status(404).json({error: "Review was not found"});
            }

        } catch (e) {
            res.status(500).json({error: "Database error", message: e});
        }

    } else {
        res.status(401).json({error: "Not logged in"});
    }
});

module.exports = router;

/** Updates user level, based on the number of "positive" reviews, where "positive" means that the difference between likes and dislikes is greater than zero */
async function updateUserProgress(userid) {
    //get all the reviews writte by this user

    try {

        const reviews = await Review.find({user: userid}).exec();
        const positiveRevNumber = reviews.filter((rev) => rev.likes.length > rev.dislikes.length).length;
        let level = 0;

        if(positiveRevNumber == 0) {
            level = 0;
        } else if(positiveRevNumber <= 3) {
            level = 1;
        } else if(positiveRevNumber <= 6) {
            level = 2;
        } else if(positiveRevNumber <= 10) {
            level = 3;
        } else if(positiveRevNumber <= 15) {
            level = 4;
        } else if(positiveRevNumber > 15) {
            level = 5;
        }

        await User.updateOne({_id: userid}, {level: level});

    } catch (error) {
        console.error(error);
    }
}