function isAuthenticated(req, res, next) {
  if (req.session.userId) {
      return next(); // User is authenticated, proceed
  } else {
      return res.status(401).json({ message: 'You must be logged in to access this resource' });
  }
}

module.exports = isAuthenticated;