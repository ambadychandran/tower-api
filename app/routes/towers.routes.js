
const passportJWT = require('passport-jwt');
const passport = require('passport');
const db = require("../models");

const Users = db.users;
let ExtractJwt = passportJWT.ExtractJwt;
let JwtStrategy = passportJWT.Strategy;

let jwtOptions = {};
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
jwtOptions.secretOrKey = 'wowwow';

const getUser = async obj => {
  return await Users.findOne({
  where: obj,
});
};

// lets create our strategy for web token
let strategy = new JwtStrategy(jwtOptions, function(jwt_payload, next) {
  console.log('payload received', jwt_payload);
  let user = getUser({ id: jwt_payload.id });
  if (user) {
    next(null, user);
  } else {
    next(null, false);
  }
});
// use the strategy
passport.use(strategy);

module.exports = app => {
  const towers = require("../controllers/towers.controller.js");

  var router = require("express").Router();

  router.get('/', passport.authenticate('jwt', { session: false }), function(req, res) {
    towers.findAll(req, res);
  });

  // Create a new towers
  router.post("/", towers.create);

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
