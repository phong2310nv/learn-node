const passport = require("passport");

module.exports = (app) => {
  app.get(
    "/auth/google",
    passport.authenticate("google", {
      scope: ["profile", "email"],
    })
  );

  app.get(
    "/auth/google/callback",
    passport.authenticate("google", { failureRedirect: "/" }),
    (req, res) => {
      res.redirect("/blogs");
    }
  );

  app.get("/auth/logout", (req, res) => {
    req.session = null; // Clear session manually
    res.redirect("/");
    // req.logout(function (err) {
    //   if (err) {
    //     return next(err);
    //   }
    //   req.session.destroy(() => {
    //     res.redirect("/"); // Redirect to home page or login page
    //   });
    // });
  });

  app.get("/api/current_user", (req, res) => {
    res.send(req.user);
  });
};
