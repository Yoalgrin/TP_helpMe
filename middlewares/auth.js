// middlewares/auth.js
function requireAuth(req, res, next) {
  if (!req.session.user) {
    console.log("Utilisateur non connecté, redirection vers /login");
    return res.redirect("/users/login");
  }
  next();
}

module.exports = { requireAuth };
