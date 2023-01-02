const express = require("express");
const router = express.Router();
const { Post, Comment, User } = require("../models");

// base url === /

// Index
router.get("/", async function (req, res) {
    try {
        const allPosts = await Post.find({});
        const context = {
            posts: allPosts,
        };
        return res.render("home", context);
    } catch (error) {
        console.log(error);
    }
});

function isAuthenticated(req, res, next){
    if (!User.isAuthenticated){
        res.render('auth/login');
    } 
    next();
};
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
        });
    });
});

/* New
router.get("/new", function (req, res) {
    res.render("posts/new");
});
*/

// Create
router.post("/posts", async function (req, res, next) {
    try { // body == data incoming with a request
        const data = req.body;
        data.user = req.session.currentUser.id;
        await Post.create(data);
        return res.redirect("/");
    } catch (error){
        console.log(error);
        req.error = error;
        return next();
    }
});

// Delete
router.delete("/posts/:id", function (req, res, next) {
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
router.get("/:id/edit", function (req, res, next) {
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
router.put("/:id", function (req, res, next) {
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

module.exports = router;