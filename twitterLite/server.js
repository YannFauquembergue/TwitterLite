const express = require('express');
const bcrypt = require('bcrypt');
const cors = require('cors');
const mysql = require('mysql');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

const db = mysql.createConnection({
  host: '192.168.65.121',
  user: 'newboris',
  password: '481spot???!',
  database: 'twitterLite'
});

db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log('Connecté à la base de données');
});

app.post('/register', (req, res) => {
  const { username, password } = req.body;

  // Générez un token avec jwt.sign
  const token = jwt.sign({ username: req.body.username }, 'secret_key');

  // Définissez le cookie avec le token
  res.cookie('auth_token', token, { httpOnly: true });

  // Vérification si l'utilisateur existe déjà
  db.query('SELECT * FROM User WHERE username = ?', [username], async (error, results) => {
    if (error) {
      throw error;
    }

    if (results.length > 0) {
      res.status(409).json({ error: "Cet utilisateur existe déjà" });
    } else {
      // Hachage du mot de passe
      const hashedPassword = await bcrypt.hash(password, 10);

      // Enregistrement de l'utilisateur dans la base de données avec le mot de passe haché et le token
      db.query('INSERT INTO User (username, password, token) VALUES (?, ?, ?)', [username, hashedPassword, token], (error, results) => {
        if (error) {
          throw error;
        }
        res.status(201).json("Utilisateur enregistré avec succès");
      });
    }
  });
});

app.post('/postTweet', (req, res) => {
  const { content, idUser } = req.body;

  db.query('INSERT INTO Tweet (content, idUser) VALUES (?, ?)', [content, idUser], (error, results) => {
    if (error) {
      throw error;
    }
    res.status(201).json("Tweet publié !");
  });
});

app.get('/tweets', (req, res) => {
  db.query('SELECT Tweet.content, User.username FROM Tweet INNER JOIN User ON Tweet.idUser = User.id', (error, results) => {
    if (error) {
      throw error;
    }
    res.status(200).json(results);
  });
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;

  const token = jwt.sign({ username: req.body.username }, 'secret_key');

  res.cookie('auth_token', token, { httpOnly: true });

  db.query('SELECT * FROM User WHERE username = ?', username, async (error, results) => {
    if (error) {
      throw error;
    }

    if (results.length === 0) {
      res.status(401).json({ error: "Nom d'utilisateur ou mot de passe incorrect" });
    } else {
      const user = results[0];

      const passwordMatch = await bcrypt.compare(password, user.password);

      if (passwordMatch) {
        db.query('UPDATE User SET token = ? WHERE username = ?', [token, username], (error, results) => {
          if (error) {
            throw error;
          }
        });

        res.cookie('local_auth_token', token, { httpOnly: false });

        res.status(200).json({ message: "Connexion réussie !" });
      } else {
        res.status(401).json({ error: "Nom d'utilisateur ou mot de passe incorrect" });
      }
    }
  });
});

// Démarrer le serveur
app.listen(port, () => {
  console.log(`Le serveur est en écoute sur le port ${port}`);
});
