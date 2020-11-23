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
    };
    
    try{
        reviewParam.rating = parseInt(reviewParam.rating);
    }catch (error) {
        res.status(400).json({ error: "Error: rating must be an integer" });
        return;
    }

    //check the range of the rating
    if(reviewParam.rating > 5 || reviewParam.rating < 0){
        res.status(400).json({ error: "Wrong value for the rating. It must be <=5 and >=0" });
        return;
    }

    //check if the review's book exists
    const book = db.books.existBook(reviewParam.book);
    if(book === null) {
        //book does not exit
        res.status(400).json({ error: "The book of the review doesn't exist" });
        return;
    }

    //find a user with this email address
    const user = db.users.getByEmail(req.param.email);
    if(user === null) {
        //user is not logged in
        res.status(401).json({ error: "Unauthorized" });
        return;
    }
    reviewParam.user = user.id;

    let reviewId = db.reviews.insert(reviewParam);
    res.location("/api/review/" + reviewId).status(201).send();
    console.log("eseguita POST /api/review");
});

/* GET /api/review/id */
router.get('/api/review/:id', (req, res) => {
    let review = db.reviews.findReviewById(req.params.id);
    review.self = `/api/review/${review.id}`;
    res.status(200).json(review);
    console.log("eseguita GET /api/review/id");
});


//TODO ELIMINA RECENSIONE

module.exports = router;