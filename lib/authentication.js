const express = require('express');
const utils = require('./utils');
const jwt = require('jsonwebtoken');
const User = require('./models/user');

const router = express.Router();

//get all the books
router.use((req, res, next) => { 
    
    const token = req.headers.authorization || req.body.authorization || req.query.authorization;
    
    const pubkey = process.env.jwt_key_public || require('../secrets.json').jwt_key_public;

    if(token) {

        
        jwt.verify(token.split("Bearer ")[1], pubkey, async (err, decoded) => {
            if(err) {
                req.logged = false;
            } else {

                const user = await User.findById(decoded.id).exec();

                if(user) {
                    req.logged = true;
                    req.loggedUser = user;
                } else {
                    req.logged = false;
                }
                
            }

            next();
        });

    } else {
        req.logged = false;
        next();
    }

    
});

router.post("/api/login", async (req, res) => {

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
    // //check if a user with that email address already exists
    const user = await User.findOne({email: email}).exec()

    if(user === null) {
        //DO NOT give hints on whether the email or the password is the wrong one
        res.status(400).json({ error: "Incorrect email or password" });
        return;
    }

    /* Check password */
    const hashedPsw = utils.hashPassword(password, user.salt);

    if(hashedPsw === user.password) {

        // if user is found and password is right create a token
        const payload = {
            id: user._id
        }

        const token = jwt.sign(payload, {
            key: process.env.jwt_key_private || require('../secrets.json').jwt_key_private,
            passphrase: process.env.jwt_key_passphrase || require('../secrets.json').jwt_key_passphrase
        }, {
            algorithm: "RS512",
            expiresIn: 86400
        });

        res.status(200).json({token: token});
    } else {
        //DO NOT give hints on whether the email or the password is the wrong one
        res.status(400).json({ error: "Incorrect email or password" });
    }

});

module.exports = router;