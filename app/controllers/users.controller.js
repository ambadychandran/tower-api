const db = require("../models");
const Users = db.users;
const Op = db.Sequelize.Op;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const passportJWT = require('passport-jwt');

let ExtractJwt = passportJWT.ExtractJwt;
let JwtStrategy = passportJWT.Strategy;
let jwtOptions = {};
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
jwtOptions.secretOrKey = 'wowwow';

// Create and Save a new User
exports.register = (req, res) => {
  // Validate request
  if (!req.body.first_name || !req.body.last_name || !req.body.user_name || !req.body.password) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
    return;
  }
  const pwd = bcrypt.hashSync(req.body.password, 10);
  // Create a user
  const user = {
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    user_name: req.body.user_name,
    password: pwd
  };
  // Save user in the database
  Users.create(user)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the user."
      });
    });
};

// login user
exports.login = (req, res) => {
  const { user_name, password } = req.body;
  if (user_name && password) {
    var condition = { user_name: { [Op.eq]: user_name } };
    Users.findOne({ where: condition })
      .then(data => {
        bcrypt.compare(password, '10', function (err, resp) {
          if (password != data.password) {
            let payload = { id: data.id };
            let token = jwt.sign(payload, jwtOptions.secretOrKey);
            res.status(200).json({ msg: 'sucess', token: token });
          } else {
            res.status(401).json({ msg: 'Password is incorrect' });
          }
        });
      })
      .catch(err => {
        res.status(401).json({ msg: 'No such user found', user });
      });
    if (!user_name) {
      res.status(401).json({ msg: 'No such user found', user });
    }
  }
};