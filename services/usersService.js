const { getDb } = require("./db");
const { ObjectId } = require("mongodb");

//  Récupère un utilisateur depuis MongoDB à partir de son username
async function findUserByUsername(username) {
  const db = getDb();
  return await db.collection("users").findOne({ username });
}

//  Valide les identifiants (login)
async function validateUser(username, password) {
  const db = getDb();
  const user = await db.collection("users").findOne({ username });
  return user && user.password === password ? user : null;
}

// ➕ Ajoute un utilisateur (utilisé pour des ajouts directs)
async function addUser(user) {
  const db = getDb();
  const result = await db.collection("users").insertOne(user);
  return result.insertedId;
}

// 👤 Crée un nouvel utilisateur (avec vérification d’unicité)
async function createUser(userData) {
  const db = getDb();
  const usersCollection = db.collection("users");

  const existingUser = await usersCollection.findOne({
    username: userData.username,
  });

  if (existingUser) {
    throw new Error("Nom d'utilisateur déjà utilisé");
  }

  await usersCollection.insertOne(userData);
}

//  Export unique (tout réuni)
module.exports = {
  findUserByUsername,
  validateUser,
  addUser,
  createUser,
};
