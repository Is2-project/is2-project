const express = require('express');
const utils = require('./utils');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



/* Create a user */
app.post('/api/users', (req, res) => {

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

    //TODO save user in the database (and get the unique id)
    const id = 0;

    res.header("Location", `/api/users/${id}`).sendStatus(201);

});

/* Gets (public) info about a user */
app.get("/api/users/:id", (req, res) => {

    const id = req.params.id;

    //TODO check if user with id == id does exist and get it from database
    if(id != 0) {
        res.status(404).json({ error: "User could not found" });
        return;
    }

    const user = {
        self: "/api/users/0",
        id: 0,
        email: "fake@test.it",
        name: "fake",
        surname: "test",
        phone: "1234567890"
    }

    res.status(200).json(user);

});

/* Gets (public) info about a user */
app.put("/api/users/:id", (req, res) => {

    const id = req.params.id;
    const email = req.query.email;

    const password = req.body.password;
    const name = req.body.name;
    const surname = req.body.surname;
    let phone = req.body.phone;

    if(email === null || email === undefined || email === "" || !utils.validateEmail(email)) {
        res.status(401).json({ error: "email is invalid or missing." });
        return;
    }

    //TODO check if user with id == id does exist and get it from database
    if(id != 0) {
        res.status(404).json({ error: "User could not found" });
        return;
    }

    const user = {
        self: "/api/users/0",
        id: 0,
        email: "fake@test.it",
        name: "fake",
        surname: "test",
        phone: "1234567890"
    }

    //TODO check if "authenticated" user can update this user (only the user itself can)
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

    //TODO update user in the database
    console.log(user);

    res.sendStatus(200);

});

app.post("/api/login", (req, res) => {

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

    //TODO find a user with this email address
    const found = true;

    if(!found) {
        //DO NOT give hints on whether the email or the password is the wrong one
        res.status(400).json({ error: "Incorrect email or password" });
        return;
    }

    const user = {
        self: '/api/users/0',
        id: 0,
        email: 'fake@test.it',
        name: 'fake',
        surname: 'test',
        phone: '1234567890',
        salt: '7287e605',
        password: '4495449be581090488dec8ab3be5f9cf'
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

/* Default 404 handler */
app.use((req, res) => {
    res.status(404);
    res.json({ error: 'Not found' });
});


//necessario per poter usare 'app' in server.js
module.exports = app;