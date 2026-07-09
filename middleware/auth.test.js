const { isAuthenticated, requireAuth } = require("./auth");

test("returns false when req.session does not exist", () => {
  // Arrange: a request object with no session property at all
  const req = {};

  // Act: call the function under test
  const result = isAuthenticated(req);

  // Assert: it should report the user is not authenticated
  expect(result).toBe(false);
});

test("req.session returns true but currentUser returns false", () => {
  const req = { session: {} }
  const result = isAuthenticated(req);
  expect(result).toBe(false);
})

test("req.session returns true but currentUser has no id", () => {
  const req = { session: { currentUser: {}}}
  const result = isAuthenticated(req);
  expect(result).toBe(false);
})

test("fully valid session should return truthy", () => {
  const req = { session: { currentUser: { id: "abc123" }}}
  const result = isAuthenticated(req);
  expect(result).toBeTruthy();
})

// testing requireAuth
test("next should be called, res.redirect should not be called", () => {
  const req = { session: { currentUser: { id: "abc123" }}}
  const next = jest.fn();
  const res = { redirect: jest.fn()};

  requireAuth(req, res, next);

  expect(next).toHaveBeenCalled();
  expect(res.redirect).not.toHaveBeenCalled();
})

test("res.redirect should be called with '/auth/login', next should not be called", () => {
  const req = { session: { currentUser: {} }}
  const next = jest.fn();
  const res = { redirect: jest.fn()};

  requireAuth(req, res, next);

  expect(next).not.toHaveBeenCalled();
  expect(res.redirect).toHaveBeenCalledWith("/auth/login");
})
