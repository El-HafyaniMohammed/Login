const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const path = require('path');
const User = require('../models/User'); // Assure-toi que ce chemin est correct

const app = express();
const port = 3000;

// Connexion à MongoDB
mongoose.connect('mongodb://localhost:27017/authDB')
  .then(() => console.log("✅ Connecté à MongoDB"))
  .catch(err => console.error("❌ Connexion échouée", err));

// Middlewares pour parser les requêtes
app.use(express.urlencoded({ extended: true })); // Pour les formulaires HTML
app.use(express.json()); // Pour les requêtes JSON
app.use(express.static(path.join(__dirname, '../public'))); // Sert le HTML et CSS

// Route de login
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });
  if (!user) {
    return res.send("❌ Utilisateur non trouvé");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (isMatch) {
    res.send("✅ Connexion réussie !");
  } else {
    res.send("❌ Mot de passe incorrect");
  }
});

// Route de test pour créer un utilisateur
app.get('/register-test', async (req, res) => {
  const hashedPassword = await bcrypt.hash('1234', 10);
  await User.create({ username: 'admin', password: hashedPassword });
  res.send('Utilisateur test créé avec mot de passe "1234"');
});

// Démarrage du serveur
app.listen(port, () => {
  console.log(`🚀 Serveur sur http://localhost:${port}`);
});
