module.exports = app => {
  const towers = require("../controllers/towers.controller.js");

  var router = require("express").Router();

  // Create a new towers
  router.post("/", towers.create);

  // Retrieve all towers
  router.get("/", towers.findAll);

  // Retrieve a single towers with id
  router.get("/:id", towers.findOne);

  // Update a towers with id
  router.put("/:id", towers.update);

  // Delete a towers with id
  router.delete("/:id", towers.delete);

  // Delete all towers
  router.delete("/", towers.deleteAll);

  app.use('/api/towers', router);
};
