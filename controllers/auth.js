const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const {User} = require("../models");

// base url === /

// register form
// GET /register
router.get("/signup", function (req, res, next) {
    res.render("auth/signup");
});

// create user
// POST /register
router.post("/signup", async function (req, res, next) {
    try {
        // check if user laready exists
        // .exists returns true or false for whether something exists
        const userDoesExist = await User.exists({email: req.body.email});
        // - if they do exist, redirect to login
        if (userDoesExist) {
            return res.redirect("/login");
        }
        // - if they do not exist, we will create a new user and then redirect to login
        // -- modify the req.body data to hash and salt the password
        // salt -> generates a random addition to the table for increased hash complexity
        const salt = await bcrypt.genSalt(10);
        // hash -> convert normal string into a "random" string
        const hash = await bcrypt.hash(req.body.password, salt);
        req.body.password = hash;
        await User.create(req.body);
        return res.redirect("/login");
    } catch (error) {
        req.error = error;
        console.log(error);
        return next();
    }
});

// login form
// GET /login
router.get("/auth/login", function (req, res, next) {
    return res.render("auth/login");
});

// authenticate user
// POST /login
router.post("/login", async function (req, res, next) {
    try {
        // check if user exists in database by email
        const foundUser = await User.findOne({email: req.body.email});
        // - if user does not exist, redirect to register
        if (!foundUser) {
            return res.redirect("/signup");
        }
        // - if user does exists
        // -- grab the user's hashed password and verify it against the given password
        const match = await bcrypt.compare(req.body.password, foundUser.password);
        // --- if no match -> tell the user password/email ivalid
        if (!match) {
            return res.render("/login");
        }
        // --- if match -> issue cookie
        // add the user's authentication to the cookie
        req.session.id = {
            id: foundUser._id,
            username: foundUser.username,
        };
        // redirect to /
        return res.redirect("/");
    } catch (error) {
        console.log(error);
        req.error = error;
        return next();
    }
});

// logout
// GET /logout
router.get("/logout", async function (req, res, next) {
    try {
        await req.session.destroy();
        return res.redirect("/login");
    } catch (error) {
        console.log(error);
        req.error = error;
        return next();
    }
});

module.exports = router;