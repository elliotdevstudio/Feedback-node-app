const express = require("express");
const router = express.Router();
const { Post, Comment, User } = require("../models");

// Create
router.post("/:id", async function (req, res, next) {
    try { // body == data incoming with a request
        const data = req.body;
        data.user = req.session._id;
        data.post = req.params.id;
        await Comment.create(data);
        return res.redirect("/");
    } catch (error){
        console.log(error);
        req.error = error;
        return next();
    }
});

module.exports = router;