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

/**
 * Ajoute un ticket complet déjà structuré (utile pour les formulaires)
 * @param {{ auteur: string, titre: string, description: string }} ticketData
 * @returns {Ticket}
 */
function ajouterTicket(ticketData) {
  const { auteur, titre, description } = ticketData;

  if (!auteur || !titre) throw new Error("Auteur et titre sont obligatoires");

  const ticket = new Ticket(nextId++, auteur, titre, description);
  tickets.push(ticket);
  return ticket;
}
function supprimerTicket(id) {
  tickets = tickets.filter((ticket) => ticket.id !== parseInt(id));
}

//Ticket mongo

const { getDb } = require("./db");

async function ajouterTicketMongo({ auteur, titre, description }) {
  if (!auteur || !titre) throw new Error("Auteur et titre sont obligatoires");

  const ticket = {
    auteur,
    titre,
    description,
    etat: "ouvert",
    dateCreation: new Date().toLocaleString(),
    dateCreationObj: new Date(),
  };

  const db = getDb();
  const result = await db.collection("tickets").insertOne(ticket);
  console.log("Ajout Mongo OK, ID :", result.insertedId);
  return result.insertedId;
}
async function getAllTicketsMongo() {
  const db = getDb();
  return await db
    .collection("tickets")
    .find()
    .sort({ dateCreationObj: -1 })
    .toArray();
}
const { ObjectId } = require("mongodb");
async function supprimerTicketMongo(id) {
  const db = getDb();
  const result = await db
    .collection("tickets")
    .deleteOne({ _id: new ObjectId(id) });
  return result.deletedCount > 0; // true si un ticket a été supprimé
}

// Export des fonctions pour les utiliser dans d'autres fichiers
module.exports = {
  // creerTicket,
  //getAllTickets,
  // resetTickets,
  //ajouterTicket,
  //supprimerTicket,
  ajouterTicketMongo,
  getAllTicketsMongo,
  supprimerTicketMongo,
};
