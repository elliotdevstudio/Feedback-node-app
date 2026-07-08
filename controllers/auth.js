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

router.post("/signup", async function (req, res, next) {
    try {
        // check if user laready exists
        // .exists returns true or false for whether something exists
        const userDoesExist = await User.exists({email: req.body.email});
        // - if they do exist, redirect to login
        if (userDoesExist) {
            return res.redirect("/auth/login");
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
        console.log(error);
        req.error = error;
        return next();
    }
});
// create user

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
        // - if user does not exist -> re-render login with an error
        // (deliberately the same message as a bad password, so we don't
        // reveal whether an email is registered)
        if (!foundUser) {
            return res.render("auth/login", {
                error: "Invalid email or password.",
            });
        }
        // - if user does exists
        // -- grab the user's hashed password and verify it against the given password
        const match = await bcrypt.compare(req.body.password, foundUser.password);
        // --- if no match -> tell the user password/email invalid
        if (!match) {
            return res.render("auth/login", {
                error: "Invalid email or password.",
            });
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

// forgot password form
// GET /forgot-password
router.get("/forgot-password", function (req, res, next) {
    return res.render("auth/forgot-password");
});

// reset password using just the account email
// POST /forgot-password
router.post("/forgot-password", async function (req, res, next) {
    try {
        const foundUser = await User.findOne({email: req.body.email});
        // - if no account matches that email, re-render with an error
        if (!foundUser) {
            return res.render("auth/forgot-password", {
                error: "No account found with that email address.",
            });
        }
        // - hash and save the new password, same as signup
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(req.body.password, salt);
        foundUser.password = hash;
        await foundUser.save();
        return res.render("auth/login", {
            success: "Password updated. Please log in.",
        });
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
        return res.redirect("/auth/login");
    } catch (error) {
        console.log(error);
        req.error = error;
        return next();
    }
});

module.exports = router;
