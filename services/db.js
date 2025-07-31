// services/db.js
const { MongoClient } = require("mongodb");

const uri = process.env.MONGO_URI || "mongodb://localhost:27017";
const client = new MongoClient(uri);

let db;

async function connect() {
  await client.connect();
  db = client.db("helpme"); // nom de ta base
  console.log("✅ Connexion à MongoDB réussie");
}

function getDb() {
  if (!db) throw new Error("DB non connectée");
  return db;
}

module.exports = { connect, getDb };
