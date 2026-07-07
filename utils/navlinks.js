const { isAuthenticated } = require("../middleware/auth");

const protectedRoutes = [
    { href: "/", title: "Home"},
    { href: "/new", title: "Create Post"},
    { href: "/auth/logout", title: "Logout"}
];

const publicRoutes = [
    { href: "/auth/login", title: "Login" },
    { href: "/auth/signup", title: "Sign Up"}
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