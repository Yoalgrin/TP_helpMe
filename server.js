// Charge les variables d'environnement
require("dotenv").config();

// Constantes de configuration
const EXPRESS_VIEW_ENGINE = "ejs";
const VIEWS_FOLDER = "./views";
const STATIC_FOLDER = "public";
const BASE_ROUTE = "/"; // route d'entrée

// Importe express
const express = require("express");
const app = express();

// Importe les routeurs
const ticketRoutes = require("./routes/ticketRoutes");

// Configure le moteur de vues
app.set("view engine", `${EXPRESS_VIEW_ENGINE}`);
app.set("views", `${VIEWS_FOLDER}`);
app.use(express.static(`${STATIC_FOLDER}`));

// Branche les routes de tickets
app.use(`${BASE_ROUTE}`, ticketRoutes);

// Récupère le port depuis .env
const port = process.env.PORT_NO || 3000;

// Lance le serveur
app.listen(port, () => {
  console.log(`Serveur lancé sur http://localhost:${port}`);
});
