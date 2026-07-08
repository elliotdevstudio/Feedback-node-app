require("../config/db.connection");

const User = require("../models/User");

const users = [
    {
        username: "",
        email: "",
        password: "",
        avatar: ""
    },
    {
        username: "",
        email: "",
        password: "",
    }
];

const reseedUsers = async function reseedUsers () {
    try {
        await User.deleteMany({});
        const createdUsers = await User.insertMany(users);
        console.log("=== Seed Complete ===", createdUsers);
    } catch (error) {
        console.log(error);
    }
};

reseedUsers();