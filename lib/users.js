const express = require('express');
const utils = require('./utils');
const User = require('./models/user');

const router = express.Router();

/* Create a user */
router.post('/api/users', async (req, res) => {

    const email = req.body.email;
    const password = req.body.password;
    const name = req.body.name;
    const surname = req.body.surname;
    let phone = req.body.phone;

    /* input checking */
    if(email === null || email === undefined || email === "" || !utils.validateEmail(email)) {
        res.status(400).json({ error: "email is invalid or missing." });
        return;
    }

    if(password === null || password === undefined || password === "") {
        res.status(400).json({ error: "password is required." });
        return;
    }

    if(name === null || name === undefined || name === "") {
        res.status(400).json({ error: "name is required." });
        return;
    }

    if(surname === null || surname === undefined || surname === "") {
        res.status(400).json({ error: "surname is required." });
        return;
    }

    //set to null if undefined or empty string
    if(phone === undefined || phone === "") {
        phone = null;
    }

    // //check if a user with that email address already exists
    if(await User.findOne({email: email}).exec()) {
        res.status(400).json({ error: "email already in use." });
        return;
    }

    //hash the password with salt and pepper to make it secure!
    const salt = utils.generateSalt();
    const hashedPsw = utils.hashPassword(password, salt);

    const user = new User({
        email: email,
        password: hashedPsw,
        salt: salt,
        name: name,
        surname: surname,
        phone: phone,
    });

    try {
        await user.save();
        res.header("Location", `/api/users/${user._id}`).sendStatus(201);
    } catch (e) {
        res.status(500).json({error: "Database error", message: e});
    }

});

/* Gets (public) info about a user */
router.get("/api/users/:id", async (req, res) => {

    const id = req.params.id;

    if(!id) {
        res.status(400).json({ error: "Id invalid or missing" });
        return;
    }

    //check if user with id == id does exist and get it from database

    try {
        const user = await User.findById(id).exec();
        if(user === null) {
            res.status(404).json({ error: "User could not found" });
            return;
        }

        res.status(200).json({
            self: `/api/users/${user._id}`,
            id: user._id,
            name: user.name,
            surname: user.surname,
            email: user.email,
            phone: user.phone,
            level: user.level
        });
    } catch (e) {
        res.status(500).json({error: "Database error", message: e});
    }

});

/* Updates info about a user */
router.put("/api/users/:id", async (req, res) => {

    if(req.logged === true) {

        const id = req.params.id;

        if(!id) {
            res.status(400).json({ error: "id is invalid or missing." });
            return;
        }

        const password = req.body.password;
        const name = req.body.name;
        const surname = req.body.surname;
        let phone = req.body.phone;

        let user = req.loggedUser;
    
        //check if "authenticated" user can update this user (only the user itself can)
        if(id != user._id.toString()) {
            res.status(401).json({ error: "You cannot edit another user's info" });
            return;
        }
    
        /* input checking */
    
        if(password !== null && password !== undefined) {
            
            if(password === "") {
                res.status(400).json({ error: "password cannot be empty." });
                return;
            }
    
            user.salt = utils.generateSalt();
            user.password = utils.hashPassword(password, user.salt);
            
        }
    
        if(name !== null && name !== undefined) {
            
            if(name === "") {
                res.status(400).json({ error: "name cannot be empty." });
                return;
            }
            
            user.name = name;
        }
    
        if(surname !== null && surname !== undefined) {
            
            if(surname === "") {
                res.status(400).json({ error: "surname cannot be empty." });
                return;
            }
    
            user.surname = surname;
            
        }
    
        if(phone !== null && phone !== undefined) {
            //NOTE phone CAN be empty
            if(phone === "") {
                user.phone = null;
            } else {
                user.phone = phone;
            }
            
        }
    
        try {
            await user.save();
            res.sendStatus(200);
        } catch(e) {
            res.status(500).json({error: "Database error", message: e});
        }

    } else {
        res.status(401).json({ error: "Not logged in." });
    }

});

module.exports = router;