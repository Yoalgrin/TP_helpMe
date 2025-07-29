// Charge les variables d'environnement
require("dotenv").config();

// Importe express
const express = require("express");
const app = express();

// Configure le moteur de vues EJS
app.set("view engine", "ejs");
app.set("views", "./views"); // Dossier racine "views"
app.use(express.static("public"));

// Route GET /
app.get("/", (req, res) => {
  res.render("index");
});
app.get("/tickets", (req, res) => {
  res.render("liste-tickets");
});

// Récupère le port depuis .env
const port = process.env.PORT_NO || 3000;

// Lance le serveur
app.listen(port, () => {
  console.log(`Serveur lancé sur http://localhost:${port}`);
});
