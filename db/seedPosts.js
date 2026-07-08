require("../config/db.connection");

const Post = require("../models/Post");

const posts = [
    {
        title: "",
        content: "",
        user: "",
    }
];

const reseedPosts = async function reseedPosts () {
    try {
        await Post.deleteMany({});
        const createdPosts = await Post.insertMany(posts);
        console.log("=== Seed Complete ===", createdPosts);
    } catch (error) {
        console.log(error);
    }
};

reseedPosts();