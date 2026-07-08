require("../config/db.connection");

const Comment = require("../models/Comment");

const comments = [
    {
        type: "",
        content: "",
        post: "",
        user: "",
    }
];

const reseedComments = async function reseedComments () {
    try {
        await Comment.deleteMany({});
        const createdComments = await Comment.insertMany(comments);
        console.log("=== Seed Complete ===", createdComments);
    } catch (error) {
        console.log(error);
    }
};

reseedComments();