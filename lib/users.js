const express = require('express');
const utils = require('./utils');
const db = require('./db');

const router = express.Router();

/* Create a user */
router.post('/api/users', (req, res) => {

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

    //check if a user with that email address already exists
    if(db.users.getByEmail(email) !== null) {
        res.status(400).json({ error: "email already in use." });
        return;
    }

    //hash the password with salt and pepper to make it secure!
    const salt = utils.generateSalt();
    const hashedPsw = utils.hashPassword(password, salt);

    const user = {
        email: email,
        password: hashedPsw,
        salt: salt,
        name: name,
        surname: surname,
        phone: phone,
    }

    console.log(user);

    //save user in the database (and get the unique id)
    const id = db.users.insert(user).id;

    res.header("Location", `/api/users/${id}`).sendStatus(201);

});

/* Gets (public) info about a user */
router.get("/api/users/:id", (req, res) => {

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

    res.status(200).json({
        self: `/api/users/${user.id}`,
        id: user.id,
        name: user.name,
        surname: user.surname,
        email: user.email,
        phone: user.phone
    });

});

/* Gets (public) info about a user */
router.put("/api/users/:id", (req, res) => {

    let id = req.params.id;
    const email = req.query.email;

    const password = req.body.password;
    const name = req.body.name;
    const surname = req.body.surname;
    let phone = req.body.phone;

    try {
        id = parseInt(id);
    } catch(error) {
        res.status(400).json({ error: "id is invalid or missing." });
        return;
    }

    if(email === null || email === undefined || email === "" || !utils.validateEmail(email)) {
        res.status(401).json({ error: "email is invalid or missing." });
        return;
    }

    //check if user with id == id does exist and get it from database
    const user = db.users.get(id);

    if(user === null) {
        res.status(404).json({ error: "User could not found" });
        return;
    }

    //check if "authenticated" user can update this user (only the user itself can)
    if(email !== user.email) {
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

    db.users.update(user);

    res.sendStatus(200);

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
        res.sendStatus(200);
    } else {
        //DO NOT give hints on whether the email or the password is the wrong one
        res.status(400).json({ error: "Incorrect email or password" });
    }

});

router.post("/api/logout", (req, res) => {

    const email = req.query.email;

    if(email === null || email === undefined || email === "" || !utils.validateEmail(email)) {
        res.status(401).json({ error: "email is invalid or missing." });
        return;
    }

    res.sendStatus(200);

});

module.exports = router;