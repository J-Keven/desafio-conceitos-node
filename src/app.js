const express = require("express");
const cors = require("cors");
const {uuid, isUuid} = require("uuidv4")
// const { v4: uuid } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {

  return response.json(repositories)
});

app.post("/repositories", (request, response) => {
  const {title, url, techs} = request.body;

  if(!title || !url || !techs){
    return response.status(400).json({error: "title, url and techs is required!"})
  }

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0
  }

  repositories.push(repository)

  return response.json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const {title, url, techs} = request.body;


  if(!isUuid(id)){
    return response.status(400).json({error: "Id invalid!"})
  }
  
  if(!title || !url || !techs){
    return response.status(400).json({likes: 0})
  }

  const indexOfRepository = repositories.findIndex(item => item.id === id)
  
  if(indexOfRepository < 0){
    return response.status(400).json({error: "Id do not exist!"})
  }

  const repository = {
    id,
    title,
    url,
    techs,
    likes: repositories[indexOfRepository].likes
  }

  repositories[indexOfRepository] = repository;

  return response.json(repository)

});

app.delete("/repositories/:id", (request, response) => {

  const { id } = request.params;

  if(!isUuid(id)){
    return response.status(400).json({error: "Id invalid!"})
  }

  repositories.splice(item => item.id === id)

  return response.status(204).send()
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  if(!isUuid(id)){
    return response.status(400).json({error: "Id invalid!"})
  }

  const indexOfRepository = repositories.findIndex(item => item.id === id)
  if(indexOfRepository < 0){
    return response.status(400).json({error: "Id do not exist!"})
  }
  const repository = {
    ...repositories[indexOfRepository],
    ['likes']: repositories[indexOfRepository].likes + 1
  }

  repositories[indexOfRepository] = repository

  return response.json({likes: repositories[indexOfRepository].likes})  
});

module.exports = app;
