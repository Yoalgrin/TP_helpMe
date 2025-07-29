class Ticket {
  constructor(id, auteur, titre, description) {
    if (!auteur || !titre) {
      throw new Error("Auteur et titre sont obligatoires");
    }

    if (titre.length > 50) {
      throw new Error("Le titre ne doit pas dépasser 50 caractères");
    }

    if (description && description.length > 2000) {
      throw new Error("La description ne doit pas dépasser 2000 caractères");
    }

    this.id = id;
    this.auteur = auteur;
    this.titre = titre;
    this.description = description || "";
    this.dateCreation = Ticket.genererDate();
    this.dateCreationObj = new Date(); // utile pour trier facilement
    this.etat = "ouvert"; // par défaut
  }

  static genererDate() {
    const date = new Date();
    const pad = (n) => n.toString().padStart(2, "0");

    const jour = pad(date.getDate());
    const mois = pad(date.getMonth() + 1); // Janvier = 0
    const annee = date.getFullYear();

    const heures = pad(date.getHours());
    const minutes = pad(date.getMinutes());
    const secondes = pad(date.getSeconds());

    return `${jour}/${mois}/${annee} ${heures}:${minutes}:${secondes}`;
  }
}

module.exports = Ticket;
