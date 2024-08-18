const isAuthenticated = require("../middleware/auth");

const protectedRoutes = [
    { href: "/", title: "Home"},
    { href: "/new", title: "Create Post"},
    { href: "/logout", title: "Logout"}
];

const publicRoutes = [ 
    { href: "/login", title: "Login" },
    { href: "/signup", title: "Sign Up"}
];


module.exports = function navLinks(req, res, next) {
    if(isAuthenticated(req)){
        res.locals.routes = protectedRoutes;
        res.locals.user = req.session.currentUser;
        console.log('Routes:', res.locals.routes);
    } else {
        res.locals.routes = publicRoutes;
        console.log('Routes:', res.locals.routes);
    };
    next();
};