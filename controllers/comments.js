const express = require("express");
const router = express.Router();
const { Post, Comment, User } = require("../models");
const isAuthenticated = require("../middleware/auth");

// Create
router.post("/post/:id", async function (req, res, next) {
    
    if (!req.session.user) res.send("you must be logged in");
    try { // body == data incoming with a request
        const data = req.body;
        data.user = req.session.currentUser.id;
        data.post = req.params.id;
        await Comment.create(data);
        return res.redirect("/");
    } catch (error){
        req.error = error;
        console.log(error);
        return next();
    }
});

module.exports = router;