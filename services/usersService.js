const users = [
  {
    id: 1,
    username: "formateur",
    password: process.env.PWD_FORMATEUR,
    name: "Monsieur Formateur",
    role: 2,
  },
  {
    id: 2,
    username: "etudiant",
    password: "demo123",
    name: "Jean Apprenant",
    role: 1,
  },
];

function findUserByUsername(username) {
  return users.find((u) => u.username === username);
}

function validateUser(username, password) {
  const user = findUserByUsername(username);
  if (!user) return null;
  return user.password === password ? user : null;
}

module.exports = { findUserByUsername, validateUser };
