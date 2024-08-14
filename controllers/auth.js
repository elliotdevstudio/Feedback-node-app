const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const {User} = require("../models");

// base url === /

// register form
// GET /register
router.get("/signup", function (req, res, next) {
    return res.render("auth/signup");
});

// create user
// POST /register
router.post("/login", async function (req, res, next) {
    console.log("this route is working...");
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
            return res.render("auth/login");
        }
        // --- if match -> issue cookie
        // add the user's authentication to the cookie
        req.session.currentUser = {
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

// login form
// GET /login
router.get("/login", function (req, res, next) {
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
            return res.render("auth/login");
        }
        // --- if match -> issue cookie
        // add the user's authentication to the cookie
        req.session.currentUser = {
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
        return res.redirect("auth/login");
    } catch (error) {
        console.log(error);
        req.error = error;
        return next();
    }
});

module.exports = router;
