module.exports = app => {
  const users = require("../controllers/users.controller.js");

  var router = require("express").Router();

  // register user
  router.get("/register", users.register);

  // login user
  router.get("/login", users.login);

  app.use('/api/users', router);
};
