// Charge les variables d'environnement
require("dotenv").config();

// Constantes de configuration
const EXPRESS_VIEW_ENGINE = "ejs";
const VIEWS_FOLDER = "./views";
const STATIC_FOLDER = "public";

const { connect } = require("./services/db");

// Importe express
const express = require("express");
const session = require("express-session");
const app = express();

// Middleware pour parser les formulaires POST
app.use(express.urlencoded({ extended: true }));

// Permet d'utiliser session.user.username dans toutes les vues
app.use((req, res, next) => {
  res.locals.session = req.session;
  next();
});

// Configuration express-session
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 5 * 60 * 1000,
      httpOnly: true,
    },
  })
);

// Injecte automatiquement l'utilisateur connecté dans toutes les vues
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
});

// Configure le moteur de vues
app.set("view engine", EXPRESS_VIEW_ENGINE);
app.set("views", VIEWS_FOLDER);
app.use(express.static(STATIC_FOLDER));

// Importe et branche les routeurs
const ticketRoutes = require("./routes/ticketRoutes");
const usersRoutes = require("./routes/usersRoutes");

app.use("/tickets", ticketRoutes);
app.use("/users", usersRoutes);

// Redirection par défaut
app.get("/", (req, res) => {
  res.redirect("/tickets");
});

// Middleware 404
app.use((req, res) => {
  res.status(404).render("404");
});

// Récupère le port depuis .env
const port = process.env.PORT_NO || 3000;

// Connexion à MongoDB et lancement du serveur
connect()
  .then(() => {
    app.listen(port, () => {
      console.log(`Serveur lancé sur http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error("Erreur de connexion à MongoDB", err);
    process.exit(1);
  });
