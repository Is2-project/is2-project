const express = require('express');
const db = require('./db');
const utils = require('./utils');

const router = express.Router();

//get all the books
router.use((req, res, next) => { 
    
    if(req.cookies.email !== null) {
        //find a user with this email address
        const user = db.users.getByEmail(req.cookies.email);
        if(user === null) {
            req.logged = false;
        } else {
            req.logged = true;
            req.loggedUser = user;
        }
    } else {
        req.logged = false;
    }

    next();
});

router.post("/api/login", (req, res) => {

    const email = req.body.email;
    const password = req.body.password;

    /* Input checking */
    if(email === null || email === undefined || email === "") {
        res.status(400).json({ error: "email is required" });
        return;
    }

    if(password === null || password === undefined || password === "") {
        res.status(400).json({ error: "password is required" });
        return;
    }

    //find a user with this email address
    const user = db.users.getByEmail(email);

    if(user === null) {
        //DO NOT give hints on whether the email or the password is the wrong one
        res.status(400).json({ error: "Incorrect email or password" });
        return;
    }

    /* Check password */
    const hashedPsw = utils.hashPassword(password, user.salt);

    if(hashedPsw === user.password) {
        res.cookie('email', user.email).sendStatus(200);
    } else {
        //DO NOT give hints on whether the email or the password is the wrong one
        res.status(400).json({ error: "Incorrect email or password" });
    }

});

router.post("/api/logout", (req, res) => {

    if(req.logged) {
        res.clearCookie('email').sendStatus(200);
    } else {
        res.status(401).json({ error: "You are not logged in." });
    }

});

module.exports = router;