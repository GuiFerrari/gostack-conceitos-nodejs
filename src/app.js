const express = require("express");
const cors = require("cors");

const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories)
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const repo = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0
  }

  repositories.push(repo);

  return response.json(repo);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const repo = repositories.findIndex(repository => repository.id === id);

  if (repo < 0) {
    return response.status(400).json({error: 'Repository does not exist'})
  }

  const repository = {
    id,
    title,
    url,
    techs,
    likes: repositories[repo].likes
  };

  repositories[repo] = repository

  return response.json(repository);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const repo = repositories.findIndex(repository => repository.id === id);

  if (repo >= 0) {
    repositories.splice(repo, 1);
  } else {
    return response.status(400).json({error: 'Repository does not exist'})
  }

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const repo = repositories.findIndex(repository => repository.id === id);

  if (repo < 0) {
    return response.status(400).json({error: 'Repository does not exist'})
  }

  repositories[repo].likes ++;

  return response.json(repositories[repo]);
});

module.exports = app;
