// Charge les variables d'environnement
require("dotenv").config();

// Constantes de configuration
const EXPRESS_VIEW_ENGINE = "ejs";
const VIEWS_FOLDER = "./views";
const STATIC_FOLDER = "public";
const BASE_ROUTE = "/";

// Importe express
const express = require("express");
const session = require("express-session");
const app = express();

// Middleware pour parser les formulaires POST
app.use(express.urlencoded({ extended: true }));

// Configuration express-session
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 5 * 60 * 1000, // 5 minutes
      httpOnly: true, // Inaccessible côté JS client
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
const usersRoutes = require("./routes/usersRoutes"); // Ajoute ce fichier quand prêt

app.use(BASE_ROUTE, ticketRoutes);
app.use(BASE_ROUTE, usersRoutes); // Ajoute les routes utilisateur

// Récupère le port depuis .env
const port = process.env.PORT_NO || 3000;

// Lance le serveur
app.listen(port, () => {
  console.log(`Serveur lancé sur http://localhost:${port}`);
});
