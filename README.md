# 🆘 HelpMe - Gestion de tickets de support

**HelpMe** est une application web de gestion de tickets destinée à centraliser les demandes des utilisateurs et faciliter leur suivi par un formateur ou une équipe support.

---

## 🚀 Fonctionnalités principales

- 📝 Création de tickets par les utilisateurs
- 🧾 Consultation et réponse aux tickets
- 🔒 Authentification des utilisateurs (formateur vs apprenant)
- ⏳ Expiration automatique de session après 5 minutes
- 📚 Sauvegarde en mémoire ou dans MongoDB
- 🔍 Filtrage et tri des tickets
- 🔐 Mots de passe sécurisés (prévu avec `bcrypt`)
- 🛠️ Logs via `pino` configurables avec `.env` // En cours

---

## 🧱 Stack technique

| Technologie | Usage |
|-------------|-------|
| **Node.js** | Back-end |
| **Express.js** | Routing / serveur web |
| **MongoDB** | Base de données (persistance) |
| **EJS** | Moteur de templates côté serveur |
| **express-session** | Sessions utilisateurs |
| **dotenv** | Variables d’environnement |
| **Pino** | Logging des événements | // En cours
---

## 📁 Structure du projet

/routes → Routes Express (tickets, users)
/services → Logique métier et accès DB
/dal → Accès directs à MongoDB (optionnel)
/views → Templates EJS
/public/css → Fichiers CSS
.env → Variables d’environnement (.gitignore)
/app.js → Entrée principale

