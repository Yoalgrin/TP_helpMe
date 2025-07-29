const Ticket = require("../bo/Ticket");

let tickets = [];
let nextId = 1;

function creerTicket(auteur, titre, description) {
  if (!auteur || !titre) throw new Error("Auteur et titre sont obligatoires");
  const ticket = new Ticket(nextId++, auteur, titre, description);
  tickets.push(ticket);
  return ticket;
}

function getAllTickets() {
  return tickets;
}

function resetTickets() {
  tickets = [];
  nextId = 1;
}

module.exports = { creerTicket, getAllTickets, resetTickets };
