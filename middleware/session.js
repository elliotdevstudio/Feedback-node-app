const session = require("express-session");
const MongoStore = require("connect-mongo");

// session config
const sessionMiddleware = session({

  // where to store the sessions in mongodb
  store: MongoStore.create({mongoUrl: process.env.MONGODB_URI}),
  // secret key is used to sign the cookie to say that it is valid
  collection: 'sessions',
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false,
  // config cookie
  cookie: {
      // maxAge is how long a cookie should be valid in ms
      maxAge: 1000 * 60 * 60 * 2  // two hours
  }
});

app.use(function (req, res, next){
  req.session.example = "hello I am an added property to the session -- ";
  console.log(req.session);
  return next();
});

module.exports(sessionMiddleware);