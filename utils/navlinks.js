const protectedRoutes = [
    {
        href: "/",
        title: "Home",
    },
    {
        href: "/new",
        title: "Create Post",
    },
    
    {
        href: "/logout",
        title: "Logout",
    },

];

const publicRoutes = [ 
    {
        href: "/login",
        title: "Login",
    },
    {
        href: "/signup",
        title: "Sign Up",
    },
]


module.exports = function navLinks(req, res, next) {
    // locals
    if(req.session.currentUser){
        res.locals.routes = protectedRoutesroutes;
        res.locals.user = req.session.currentUser;
    } else {
        res.locals.routes = publicRoutes;
    }
    next();
}

