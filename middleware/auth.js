function isAuthenticated(req) {
  return !!(req.session && req.session.currentUser && req.session.currentUser.id);
  }

function requireAuth(req, res, next) {
  if (isAuthenticated(req)) {
    return next();
  }
  return res.redirect("/auth/login")
}
  

module.exports = { isAuthenticated, requireAuth };