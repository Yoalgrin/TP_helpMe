const express = require("express");
const router = express.Router();
const { validateUser } = require("../services/usersService");

// Affiche la page de connexion
router.get("/login", (req, res) => {
  console.log("Route GET /login appelée");
  res.render("login", { erreur: null });
});

// Gère la soumission du formulaire de connexion
router.post("/login", (req, res) => {
  const { username, password } = req.body;

  const user = validateUser(username, password);
  if (user) {
    // Stocke l'utilisateur dans la session
    req.session.user = {
      id: user.id,
      name: user.name,
      role: user.role,
    };
    res.redirect("/tickets");
  } else {
    res
      .status(401)
      .render("login", { erreur: "Identifiants de connexion invalides." });
  }
});

// Déconnexion
router.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/tickets");
  });
});

module.exports = router;
