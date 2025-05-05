const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = 3000;

app.use(express.json());

// Connexion à MongoDB
mongoose.connect('mongodb://localhost:27017/maBase', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('✅ Connecté à MongoDB'))
  .catch((err) => console.error(' Erreur de connexion MongoDB:', err));

// Schéma et modèle utilisateur
const User = mongoose.model('user', new mongoose.Schema({
  username: String,
  email: String,
  age: Number
}));

//  Ajouter un utilisateur
app.post('/add', async (req, res) => {
  try {
    const data = req.body;
    const user = new User(data);
    await user.save();
    res.send(user);
  } catch (err) {
    res.status(400).send(" Erreur lors de l'ajout");
  }
});

//  Afficher tous les utilisateurs
app.get('/users', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).send(" Erreur lors de la récupération");
  }
});

//  Supprimer un utilisateur par ID
app.delete('/users/:id', async (req, res) => {
  try {
    const result = await User.findByIdAndDelete(req.params.id);
    if (result) {
      return res.send('Utilisateur supprimé avec succès');
    } else {
      return res.status(404).send(' Utilisateur non trouvé');
    }
  } catch (err) {
    console.error(err);
    res.status(500).send(' Erreur serveur');
  }
});

// ✅ Mettre à jour l’âge d’un utilisateur par ID
app.put('/users/:id', async (req, res) => {
  try {
    const updateUser = await User.findByIdAndUpdate(
      req.params.id,
      { age: req.body.age },
      { new: true }
    );

    if (updateUser) {
      return res.send(`✅ Utilisateur mis à jour : ${updateUser.username}, âge: ${updateUser.age}`);
    } else {
      return res.status(404).send(' Utilisateur non trouvé');
    }
  } catch (err) {
    console.error(err);
    res.status(500).send(' Erreur serveur');
  }
});

//  Route par défaut
app.get('/', (req, res) => {
  res.send("Bienvenue sur l'API MongoDB avec Express ");
});

//  Lancer le serveur
app.listen(port, () => {
  console.log(` Serveur démarré sur http://localhost:${port}`);
});
