
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
let strategy = new JwtStrategy(jwtOptions, function (jwt_payload, next) {
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

  // Create a new towers
  router.post('/', passport.authenticate('jwt', { session: false }), function (req, res) {
    towers.create(req, res);
  });

  // Update a towers with id
  router.put('/:id', passport.authenticate('jwt', { session: false }), function (req, res) {
    towers.update(req, res);
  });

  // Delete a towers with id
  router.delete('/:id', passport.authenticate('jwt', { session: false }), function (req, res) {
    towers.delete(req, res);
  });

  // fetch all towers
  router.get("/", towers.findAll);

  // Retrieve a single towers with id
  router.get("/:id", towers.findOne);

  app.use('/api/towers', router);
};
