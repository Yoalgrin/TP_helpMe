// Import de la classe métier Ticket
const Ticket = require("../bo/Ticket");

// Tableau qui stocke tous les tickets (en mémoire, pas en BDD)
let tickets = [];

// Identifiant auto-incrémenté pour chaque nouveau ticket
let nextId = 1;

/**
 * Crée un nouveau ticket avec auteur, titre et description
 * @param {string} auteur
 * @param {string} titre
 * @param {string} description
 * @returns {Ticket} le ticket créé
 */
function creerTicket(auteur, titre, description) {
  // Sécurité : auteur et titre obligatoires
  if (!auteur || !titre) throw new Error("Auteur et titre sont obligatoires");

  // Création du ticket avec ID auto
  const ticket = new Ticket(nextId++, auteur, titre, description);

  // Ajout dans le tableau
  tickets.push(ticket);

  // Renvoi du ticket créé
  return ticket;
}

/**
 * Récupère tous les tickets existants
 * @returns {Ticket[]} tous les tickets
 */
function getAllTickets() {
  return tickets;
}

// Réinitialise tous les tickets (utile pour les tests ou le développement)

function resetTickets() {
  tickets = [];
  nextId = 1;
}

// Export des fonctions pour les utiliser dans d'autres fichiers
module.exports = { creerTicket, getAllTickets, resetTickets };
