const express = require("express");
const router = express.Router();
const {
  creerTicket,
  getAllTickets,
  resetTickets,
  ajouterTicket,
  supprimerTicket,
} = require("../services/ticketService");

const { requireAuth } = require("../middlewares/auth");
const VUE_LISTE_TICKETS = "liste-tickets";

// Ticket de test uniquement si aucun n'existe
if (process.env.NODE_ENV !== "test" && getAllTickets().length === 0) {
  creerTicket("Alice", "Ticket 1");
  creerTicket("Bob", "Ticket 2");
  creerTicket("Bob", "Ticket 3");
}

// Route principale : liste des tickets
router.get("/", (req, res) => {
  const tickets = getAllTickets();

  // Tri du plus récent au plus ancien
  tickets.sort(
    (a, b) => new Date(b.dateCreationObj) - new Date(a.dateCreationObj)
  );

  res.render(VUE_LISTE_TICKETS, {
    tickets,
    user: req.session.user, // pour afficher bouton "Créer un ticket"
  });

  // resetTickets(); // désactivé pour ne pas perdre les données
});

// Affichage du formulaire de création de ticket
router.get("/nouveau", requireAuth, (req, res) => {
  res.render("nouveau-ticket", { errors: {}, values: {} });
});

// Traitement du formulaire
router.post("/nouveau", requireAuth, (req, res) => {
  const { titre, description } = req.body;
  const errors = {};
  const values = { titre, description };

  if (!titre || titre.length > 50) {
    errors.titre = "Le titre est obligatoire (50 caractères max)";
  }
  if (!description || description.length > 2000) {
    errors.description = "La description est obligatoire (2000 caractères max)";
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).render("nouveau-ticket", { errors, values });
  }
  console.log("SESSION:", req.session);
  console.log("USER:", req.session.user);

  ajouterTicket({
    auteur: req.session.user.username,
    titre,
    description,
  });

  res.redirect("/tickets");
});

router.post("/:id/supprimer", requireAuth, (req, res) => {
  const id = parseInt(req.params.id);
  const ticket = getAllTickets().find((t) => t.id === id);

  if (!ticket) {
    return res.status(404).send("Ticket introuvable");
  }

  const user = req.session.user;

  // Seul l'auteur OU un formateur peut supprimer
  if (user.name !== ticket.auteur && user.role !== 2) {
    return res.status(403).send("Non autorisé à supprimer ce ticket");
  }

  supprimerTicket(id);
  res.redirect("/tickets");
});

router.post("/:id/supprimer", requireAuth, (req, res) => {
  const id = req.params.id;
  const ticket = getAllTickets().find((t) => t.id === parseInt(id));

  if (!ticket) return res.status(404).send("Ticket introuvable");

  // Vérifie si l'utilisateur connecté est l'auteur ou un formateur
  if (req.session.user.name !== ticket.auteur && req.session.user.role !== 2) {
    return res.status(403).send("Non autorisé à supprimer ce ticket");
  }
  // Supprimer un ticket
  supprimerTicket(id);
  res.redirect("/tickets");
});

// Détail ticket
router.get("/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const ticket = getAllTickets().find((t) => t.id === id);

  if (!ticket) return res.status(404).send("Ticket introuvable");

  res.render("detail-ticket", { ticket });
});

module.exports = router;
