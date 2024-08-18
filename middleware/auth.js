function isAuthenticated(req) {
  return req.session && req.session.currentUser && req.session.currentUser.id;
}

module.exports = isAuthenticated;