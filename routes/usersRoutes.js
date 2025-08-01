const express = require("express");
const router = express.Router();
const { validateUser, createUser } = require("../services/usersService");

// Affiche la page de connexion
router.get("/login", (req, res) => {
  console.log("Route GET /login appelée");
  res.render("login", { erreur: null });
});

// Gère la soumission du formulaire de connexion
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await validateUser(username, password); // appel à MongoDB

    if (user) {
      req.session.user = {
        id: user._id,
        name: user.name,
        username: user.username,
        role: user.role,
      };
      console.log("Connexion réussie :", req.session.user);
      res.redirect("/tickets");
    } else {
      console.log("Identifiants invalides");
      res.status(401).render("login", {
        erreur: "Identifiants de connexion invalides.",
      });
    }
  } catch (err) {
    console.error("Erreur lors de la tentative de connexion :", err);
    res.status(500).send("Erreur serveur");
  }
});

// Déconnexion
router.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/tickets");
  });
});

// inscription
router.get("/register", (req, res) => {
  res.render("register", { erreur: null });
});

router.post("/register", async (req, res) => {
  const { username, password, role, lastname, firstname, birthdate, email } =
    req.body;

  try {
    await createUser({
      username,
      password,
      role: parseInt(role), // Pour stocker apprenant et formateur en nombre au lieu d'une chaine
      lastname,
      firstname,
      birthdate,
      email,
    });

    res.redirect("/users/login");
  } catch (err) {
    console.error("Erreur lors de la création de l'utilisateur :", err);
    res.status(500).render("register", {
      erreur: "Impossible de créer l'utilisateur.",
    });
  }
});

module.exports = router;
