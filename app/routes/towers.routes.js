
const passportJWT = require('passport-jwt');
const passport = require('passport');
const db = require("../models");
const appConfig = require("../config/app.config.js");

const Users = db.users;
let ExtractJwt = passportJWT.ExtractJwt;
let JwtStrategy = passportJWT.Strategy;

let jwtOptions = {};
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
jwtOptions.secretOrKey = appConfig.JWTSECRTKEY;

const getUser = async obj => {
  return await Users.findOne({
    where: obj,
  });
};

//  web token strategy
let strategy = new JwtStrategy(jwtOptions, function (jwt_payload, next) {
  let user = getUser({ id: jwt_payload.id });
  if (user) {
    next(null, user);
  } else {
    next(null, false);
  }
});
// use the strategy
passport.use(strategy);

module.exports = (app,io) => {
  const towers = require("../controllers/towers.controller.js");

  var router = require("express").Router();

  // Create a new towers
  router.post('/', passport.authenticate('jwt', { session: false }), function (req, res) {
    towers.create(io, req, res);
  });

  // Update a towers with id
  router.put('/:id', passport.authenticate('jwt', { session: false }), function (req, res) {
    towers.update(io, req, res);
  });

  // Delete a towers with id
  router.delete('/:id', passport.authenticate('jwt', { session: false }), function (req, res) {
    towers.delete(io, req, res);
  });

  // List all towers
  router.get("/", towers.findAll);

  // Search towers
  router.get("/serach", towers.search);

  // fetch towers with id
  router.get("/:id", towers.findOne);

  app.use('/api/towers', router);
};
