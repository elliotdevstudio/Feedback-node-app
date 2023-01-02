/* === External modules === */
const express = require("express");
const methodOverride = require("method-override");

// session modules
const session = require("express-session");
const MongoStore = require("connect-mongo");

/* === Internal modules === */
const controllers = require("./controllers");

/* === System Variables === */
const app = express();
const PORT = 4000;

/* === Server Configuration === */
// mongodb connection
require("./config/db.connection");

// view engine
app.set("view engine", "ejs");

// serve public folder
app.use(express.static("public"));

// handle form data
app.use(express.urlencoded({ extended: false }));

// override request methods
app.use(methodOverride("_method"));

// session config
app.use(session({

    // where to store the sessions in mongodb
    store: MongoStore.create({mongoUrl: process.env.MONGODB_URI}),
    // secret key is used to sign the cookie to say that it is valid
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    // config cookie
    cookie: {
        // maxAge is how long a cookie should be valid in ms
        maxAge: 1000 * 60 * 60 * 24 * 7 * 2, // two weeks
    }
}));

/* === Middleware === */


// adds routes for navbar
app.use(require("./utils/navlinks"));


/* === Routes === */

// == Default Routes




app.use("/", controllers.post);
app.use("/comments", controllers.comment);

// == Auth
app.use("/signup", controllers.auth);

/* === Server Listener === */
app.listen(PORT, function () {
    console.log(`Server is live and listening at localhost:${PORT}.`);
});