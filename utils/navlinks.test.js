const navLinks = require("./navlinks");

test("isAuthenticated is true and protected routes are passed", () => {
  const req = { session: { currentUser: {id: "abc123"}}};
  const res = { locals: {} };
  const next = jest.fn();

  navLinks(req, res, next);

  expect(res.locals.routes).toEqual([
    { href: "/", title: "Home"},
    { href: "/new", title: "Create Post"},
    { href: "/auth/logout", title: "Logout"}
  ]);

  expect(res.locals.user).toEqual(req.session.currentUser);

  expect(next).toHaveBeenCalled();
});

test("is unAuthenticated and public routes are passed", () => {
  const req = { session: {} };
  const res = { locals: {} };
  const next = jest.fn();

  navLinks(req, res, next);

  expect(res.locals.routes).toEqual([
    { href: "/auth/login", title: "Login" },
    { href: "/auth/signup", title: "Sign Up"}
  ]);

  expect(next).toHaveBeenCalled();
});