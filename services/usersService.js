const { getDb } = require("./db");
const { ObjectId } = require("mongodb");

// Récupère un utilisateur depuis MongoDB par son username
async function findUserByUsername(username) {
  const db = getDb();
  return await db.collection("users").findOne({ username });
}

// Valide les identifiants (login)
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

// Crée un nouvel utilisateur avec vérification d’unicité du username
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

// Vérifie si un email est déjà utilisé
async function findUserByEmail(email) {
  const db = getDb();
  const collection = db.collection("users");

  const user = await collection.findOne({ email });
  console.log(
    "Recherche d'utilisateur par email :",
    email,
    "→ trouvé :",
    user?.username ?? "aucun"
  );

  return user;
}

// Met à jour les champs modifiables du profil
async function updateUserFields(id, fields) {
  const db = getDb();
  const collection = db.collection("users");

  await collection.updateOne({ _id: new ObjectId(id) }, { $set: fields });

  return await collection.findOne({ _id: new ObjectId(id) });
}

// Exports
module.exports = {
  findUserByUsername,
  validateUser,
  addUser,
  createUser,
  findUserByEmail,
  updateUserFields,
};
