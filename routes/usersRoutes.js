const express = require("express");
const router = express.Router();
const { validateUser, createUser } = require("../services/usersService");
const usersService = require("../services/usersService");

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
        username: user.username,
        lastname: user.lastname,
        firstname: user.firstname,
        email: user.email,
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

router.get("/profil/modifier-user", (req, res) => {
  if (!req.session.user) {
    return res.redirect("/users/login");
  }

  res.render("modifier-user", {
    user: req.session.user,
    session: req.session,
    erreur: null, // ← ici !
  });
});

router.post("/profil/modifier-user", async (req, res) => {
  if (!req.session.user) {
    return res.redirect("/users/login");
  }

  const { lastname, firstname, email } = req.body;
  const userId = req.session.user.id;

  try {
    const userExists = await usersService.findUserByEmail(email);
    console.log("User trouvé pour cet email :", userExists?._id?.toString());

    // ✅ Vérifie que l'e-mail est utilisé par un autre utilisateur
    if (userExists && userExists._id.toString() !== userId.toString()) {
      return res.render("modifier-user", {
        user: { ...req.body, id: userId },
        erreur: "L'adresse e-mail est déjà utilisée par un autre utilisateur.",
        session: req.session,
      });
    }

    const updatedUser = await usersService.updateUserFields(userId, {
      lastname,
      firstname,
      email,
    });

    // Met à jour la session avec les infos complètes
    req.session.user = {
      id: updatedUser._id.toString(),
      username: updatedUser.username,
      firstname: updatedUser.firstname,
      lastname: updatedUser.lastname,
      email: updatedUser.email,
      role: updatedUser.role,
    };

    res.redirect("/users/profil");
  } catch (error) {
    console.error("Erreur lors de la mise à jour du profil :", error);
    res.status(500).send("Erreur serveur lors de la mise à jour du profil.");
  }
});

router.get("/profil", (req, res) => {
  if (!req.session.user) {
    return res.redirect("/users/login");
  }

  res.render("profil", {
    user: req.session.user,
    session: req.session,
  });
});

module.exports = router;
