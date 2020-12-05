const db = require("../models");
const Towers = db.towers;
const Op = db.Sequelize.Op;

// Create and Save a new Towers
exports.create = (req, res) => {
  // Validate request
  if (!req.body.name) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
    return;
  }

  // Create a Towers
  const tower = {
    name: req.body.name,
    location: req.body.location,
    number_of_floors: req.body.number_of_floors,
    number_of_offices: req.body.number_of_offices,
    rating: req.body.rating,
    latitude: req.body.latitude,
    longitude: req.body.longitude
  };

  // Save Towers in the database
  Towers.create(tower)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Towers."
      });
    });
};

// Retrieve all Towers from the database.
exports.findAll = (req, res) => {
  const name = req.query.name;
  var condition = name ? { name: { [Op.like]: `%${name}%` } } : null;

  Towers.findAll({ where: condition })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving towers."
      });
    });
};

// Find a single Towers with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Towers.findByPk(id)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving Towers with id=" + id
      });
    });
};

// Update a Towers by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;

  Towers.update(req.body, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Towers was updated successfully."
        });
      } else {
        res.send({
          message: `Cannot update Towers with id=${id}. Maybe Towers was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Towers with id=" + id
      });
    });
};

// Delete a Towers with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Towers.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Towers was deleted successfully!"
        });
      } else {
        res.send({
          message: `Cannot delete Towers with id=${id}. Maybe Towers was not found!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete Towers with id=" + id
      });
    });
};