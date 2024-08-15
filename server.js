/* === External modules === */
const express = require("express");
const methodOverride = require("method-override");
const sessionMiddleware = require('./middleware/session');


const MongoStore = require("connect-mongo");

//security modules
// const morgan = require("morgan");
// const rateLimit = require("express-rate-limit");
// const helmet = require("helmet");
// const mongoSanitize = require("express-mongo-sanitize");
// const hpp = require("hpp");

//look into MIME sniffing 
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

app.use(express.json());
// serve public folder
app.use(express.static("public"));

// handle form data
app.use(express.urlencoded({ extended: false }));

// override request methods -- include in URL
app.use(methodOverride("_method"));



/* === Middleware === */
app.use(sessionMiddleware);



app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

app.use(require("./utils/navlinks"));
/* === Routes === */

// == Default Routes
// Index

app.use("/", controllers.post);
app.use("/comments", controllers.comment);

// == Auth
app.use("/auth", controllers.auth);

// app.use(handleError);
/* === Server Listener === */
app.listen(PORT, function () {
    console.log(`Server is live and listening at localhost:${PORT}.`);
});

