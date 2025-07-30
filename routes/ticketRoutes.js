const express = require("express");
const router = express.Router();
const {
  creerTicket,
  getAllTickets,
  resetTickets,
} = require("../services/ticketService");

const ROUTE_ACCUEIL = "/";
const ROUTE_TICKETS = "/tickets";
const VUE_LISTE_TICKETS = "liste-tickets";
const { requireAuth } = require("../middlewares/auth");

// Ticket de test uniquement si aucun n'existe
if (process.env.NODE_ENV !== "test" && getAllTickets().length === 0) {
  creerTicket("Alice", "Ticket 1");
  creerTicket("Bob", "Ticket 2");
  creerTicket("Bob", "Ticket 3");
}

// Route principale pour afficher les tickets
router.get([ROUTE_ACCUEIL, ROUTE_TICKETS], (req, res) => {
  const tickets = getAllTickets();

  // Tri du plus récent au plus ancien
  tickets.sort(
    (a, b) => new Date(b.dateCreationObj) - new Date(a.dateCreationObj)
  );

  // On envoie la liste des tickets à la vue
  res.render(VUE_LISTE_TICKETS, { tickets });

  //Désactivé pour conserver les tickets entre les redémarrages du serveur
  //resetTickets();
});

// Création d’un nouveau ticket (protégée par requireAuth)
router.post("/tickets", requireAuth, (req, res) => {
  const { titre, auteur, description } = req.body;

  if (!titre || !auteur) {
    return res.status(400).send("Titre et auteur obligatoires");
  }

  creerTicket(auteur, titre, description || "");
  res.redirect("/tickets");
});

module.exports = router;
