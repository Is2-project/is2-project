const express = require('express');
const router = express.Router();
const db = require('./db.js');


/* POST /api/review */
router.post('/api/review', (req, res) => { 
    console.log("DEBUG 100");
    //review parameters
    let reviewParam = {
        description: req.body.description,
        rating: req.body.rating,
        book: req.body.book,
        user: req.body.user,
    };
    let reviewId = db.reviews.insert(reviewParam);
    res.location("/api/review/" + reviewId).status(201).send();
    console.log("eseguita POST /api/review");
});

/* GET /api/review/id*/
router.get('/api/review/:id', (req, res) => {
    console.log("DEBUG 200");
    let review = db.reviews.findReviewById(req.params.id);
    review.self = `/api/review/${review.id}`;
    res.status(200).json(review);
    console.log("eseguita GET /api/review/id");
});

module.exports = router;