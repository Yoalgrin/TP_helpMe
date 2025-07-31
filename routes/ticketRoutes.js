const express = require("express");
const router = express.Router();
const { ObjectId } = require("mongodb");

const {
  //creerTicket,
  //getAllTickets,
  //resetTickets,
  //ajouterTicket,
  //supprimerTicket,
  ajouterTicketMongo,
  getAllTicketsMongo,
  supprimerTicketMongo,
  getTicketByIdMongo,
} = require("../services/ticketService");

const { requireAuth } = require("../middlewares/auth");
const VUE_LISTE_TICKETS = "liste-tickets";

// Route principale : liste des tickets
router.get("/", async (req, res) => {
  try {
    const tickets = await getAllTicketsMongo();

    tickets.sort(
      (a, b) => new Date(b.dateCreationObj) - new Date(a.dateCreationObj)
    );

    res.render("liste-tickets", {
      tickets,
      user: req.session.user,
    });
  } catch (err) {
    console.error("Erreur chargement tickets Mongo:", err);
    res.status(500).send("Erreur serveur");
  }
});

// Affichage du formulaire de création de ticket
router.get("/nouveau", requireAuth, (req, res) => {
  res.render("nouveau-ticket", { errors: {}, values: {} });
});

// Traitement du formulaire

router.post("/nouveau", requireAuth, async (req, res) => {
  const { titre, description } = req.body;
  const errors = {};
  const values = { titre, description };

  if (!titre || titre.length > 50) errors.titre = "Titre requis (max 50)";
  if (!description || description.length > 2000)
    errors.description = "Description requise (max 2000)";

  if (Object.keys(errors).length > 0) {
    return res.status(400).render("nouveau-ticket", { errors, values });
  }

  try {
    await ajouterTicketMongo({
      auteur: req.session.user.username,
      titre,
      description,
    });
    res.redirect("/tickets");
  } catch (err) {
    console.error(err);
    res.status(500).send("Erreur serveur");
  }
});

router.post("/:id/supprimer", requireAuth, async (req, res) => {
  console.log("Suppression demandée pour l'id :", req.params.id);
  const id = req.params.id;
  const user = req.session.user;

  if (!ObjectId.isValid(id)) {
    return res.status(400).send("ID invalide");
  }

  try {
    const ticketId = new ObjectId(id); // Optionnel : vérifier que c’est bien un ObjectId valide
    const tickets = await getAllTicketsMongo();
    const ticket = tickets.find((t) => t._id.toString() === id);

    if (!ticket) return res.status(404).send("Ticket introuvable");

    if (user.username !== ticket.auteur && user.role !== 2) {
      return res.status(403).send("Non autorisé à supprimer ce ticket");
    }

    const success = await supprimerTicketMongo(id);
    if (success) {
      res.redirect("/tickets");
    } else {
      res.status(500).send("Échec de la suppression");
    }
  } catch (err) {
    console.error("Erreur suppression Mongo :", err);
    res.status(500).send("Erreur serveur");
  }
});

// Détail ticket

router.get("/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const ticket = await getTicketByIdMongo(id);

    if (!ticket) return res.status(404).send("Ticket introuvable");

    res.render("detail-ticket", { ticket });
  } catch (err) {
    console.error("Erreur affichage détail ticket :", err);
    res.status(500).send("Erreur serveur");
  }
});

module.exports = router;
