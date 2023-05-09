const database = require("./database");

//route GET avec deux filtres :
//si le paramètre langage est fourni ds l'URL, on obtient que les locuteurs de cette langue
//si un paramètre city est fourni, on ne récupère que les personnes vivant dans cette ville

const getUsers = (req, res) => {
  let sql = "SELECT * FROM users";
  const sqlValues = [];

  if (req.query.language != null) {
    sql += " WHERE language = ?";
    sqlValues.push(req.query.language);
  }

  if (req.query.city != null) {
    sql += req.query.language != null ? " AND city = ?" : " WHERE city = ?";
    sqlValues.push(req.query.city);
  }

  database
    .query(sql, sqlValues)
    .then(([user]) => {
      res.json(user);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("Error retrieving data from database");
    });
};

//Route GET pour obtenir les utilisateurs par id
const getUsersById = (req, res) => {
  const id = req.params.id; // extract the id from the request parameter
  database
    .query("SELECT * FROM users WHERE id=? ", [id]) // pass the id as an argument
    .then(([users]) => {
      if (users[0] != null) {
        res.json(users[0]);
      } else {
        res.status(404).send("Not Found");
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(404).send("Not Found");
    });
};

//route Post permettant de conserver les nouveaux utilisateurs

const postUsers = (req, res) => {
  const { firstname, lastname, email, city, language } = req.body;

  database
    .query(
      "INSERT INTO users(firstname, lastname, email, city, language) VALUES (?, ?, ?, ?, ?)",
      [firstname, lastname, email, city, language]
    )
    .then(([result]) => {
      res.location(`api/users/${result.insertId}`).sendStatus(201); // add the closing parenthesis
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error saving the user");
    });
};

//route PUT permettant de mettre à jour un utilisateur déjà existant dans la DB

const updateUsers = (req, res) => {
  const { firstname, lastname, email, city, language } = req.body;

  database
    .query(
      "UPDATE users SET firstname = ?, lastname = ?, email = ?, city = ?, language = ? WHERE id = ?",
      [firstname, lastname, email, city, language, req.params.id]
    )
    .then(([result]) => {
      if (result.affectedRows === 0) {
        res.status(404).send("Not Found");
      } else {
        res.sendStatus(204);
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error editing the user");
    });
};

//route DELETE permettant de supprimer un utilisateur déjà existant dans la DB
const deleteUser = (req, res) => {
  const id = parseInt(req.params.id);

  database
    .query("DELETE FROM users WHERE id = ?", [id])
    .then(([result]) => {
      if (result.affectedRows === 0) {
        res.status(400).send("Not Found");
      } else {
        res.sendStatus(204);
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error deleting the user");
    });
};

module.exports = {
  getUsers,
  getUsersById,
  postUsers,
  updateUsers,
  deleteUser,
};
