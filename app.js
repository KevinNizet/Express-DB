require("dotenv").config();
const express = require("express");

const app = express();

//Midleware indispensable pour les requêtes POST
app.use(express.json());

const port = process.env.APP_PORT ?? 5001;

const welcome = (req, res) => {
  res.send("Welcome to my favourite movie list");
};

app.get("/", welcome);

const movieHandlers = require("./movieHandlers");
const userHandlers = require("./userHandlers");

const { validateMovie } = require("./validator");
const { validateUser } = require("./validator");

app.get("/api/movies", movieHandlers.getMovies);
app.get("/api/movies/:id", movieHandlers.getMovieById);
//ajout de validateMovie sur la route post et la route put (validation des saisies utilisateurs)
app.post("/api/movies", validateMovie, movieHandlers.postMovie);
app.put("/api/movies/:id", validateMovie, movieHandlers.updateMovie);
app.delete("/api/movies/:id", movieHandlers.deleteMovie);

app.get("/api/users", userHandlers.getUsers);
app.get("/api/users/:id", userHandlers.getUsersById);
//ajout de validateUser sur la route post et la route put
app.post("/api/users/", validateUser, userHandlers.postUsers);
app.put("/api/users/:id", validateUser, userHandlers.updateUsers);
app.delete("/api/users/:id", userHandlers.deleteUser);

app.listen(port, (err) => {
  if (err) {
    console.error("Something bad happened");
  } else {
    console.log(`Server is listening on ${port}`);
  }
});
