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

// Ticket de test uniquement si aucun n'existe
if (getAllTickets().length === 0) {
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

module.exports = router;
