const express = require("express");
const router = express.Router();
const { Post, Comment, User } = require("../models");
const isAuthenticated = require("../middleware/auth");

router.get("/", async function (req, res, next) {
    
    try {
        const allPosts = await Post.find({}).populate("user");
        const context = {
            posts: allPosts,
            routes: res.locals.routes
        };
        return res.render("home", context);
    } catch (error) {
        console.log(error);
    } 
    
  });


// Show
router.get("/:id", isAuthenticated, function (req, res, next) {
   
    Post.findById(req.params.id, function (error, post) {

        if (error) {
            req.error = error;
            return next();
        }
        Comment.find({post: post._id}, function (error, foundComments) {
            if (error) {
                req.error = error;
                return next();
            }
            const context = {
                post,
                comments: foundComments
            };
            return res.render("posts/show", context);
        }).populate("user");
    }).populate("user");
});

//create
router.get("/new", isAuthenticated, function (req, res) {
        res.render("posts/new");
});

// Create
router.post("/new", isAuthenticated, async function (req, res, next) {
    try { // body == data incoming with a request
        const data = req.body;
        console.log(req);
        data.user = req.session.currentUser;
        await Post.create(data);
        console.log("Post successfully created");
        return res.redirect("/");
    } catch (error){
        req.error = error;
        console.log(error);
        return next();
    }
});

// Delete
router.delete("/:id", isAuthenticated, function (req, res, next) {
    Post.findByIdAndDelete(req.params.id, function (error, deletedPost) {
        if (error) {
            console.log(error);
            req.error = error;
            return next();
        }
        // Delete comments
        Comment.deleteMany(
            { post: req.params.id },
            function (error, deletedComments) {
            if (error) {
                console.log(error);
                req.error = error;
                return next();
            }
            return res.redirect("/");
            }
        );
    });
});
  
// Edit
router.get("/:id/edit", isAuthenticated, function (req, res, next) {
    Post.findById(req.params.id, function (error, foundPost) {
        if (error) {
            console.log(error);
            req.error = error;
            return next();
        }
        const context = {
            post: foundPost,
        };
        res.render("posts/edit", context);
    });
});

//Update
router.put("/:id", isAuthenticated, function (req, res, next) {
    Post.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true },
        function (error, updatedPost) {
            if (error) {
                console.log(error);
                req.error = error;
                return next();
            }
            res.redirect(`/${req.params.id}`);
        }
    );
});

module.exports = router