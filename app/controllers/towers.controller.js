const db = require("../models");
const cache = require('../cache');
const Towers = db.towers;
const Op = db.Sequelize.Op;
const sequelize = require('sequelize');

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

const getPagination = (page, size) => {
  const limit = size ? +size : 3;
  const offset = page ? page * limit : 0;

  return { limit, offset };
};

const getPagingData = (data, page, limit) => {
  const { count: totalItems, rows: tutorials } = data;
  const currentPage = page ? +page : 0;
  const totalPages = Math.ceil(totalItems / limit);

  return { totalItems, tutorials, totalPages, currentPage };
};

// Retrieve all Towers from the database.
exports.findAll = (req, res) => {

  cache.get(req.query.page, (err, data) => {
    console.log(req.query)
  })

  const { page, size, name, rating, location, number_of_floors, orderby, sort } = req.query;
  const showOffice = req.query['show-with-offices'] ? req.query['show-with-offices'] : null;
  let orderCon = null;
  if (orderby != undefined && sort != undefined) {
    orderCon = [sequelize.literal(`${orderby} ${sort}`)]
  }
  var condition =
  {
    [Op.or]: [
      name ? { name: { [Op.like]: `%${name}%` } } : null,
      rating ? { rating: { [Op.like]: `%${rating}%` } } : null,
      location ? { location: { [Op.like]: `%${location}%` } } : null,
      number_of_floors ? { number_of_floors: { [Op.like]: `%${number_of_floors}%` } } : null,
    ],
    [Op.and]: [
      showOffice == 'true' ? { number_of_offices: { [Op.not]: 0 } } : null
    ]
  }
  if (name == null && rating == null && location == null && number_of_floors == null) {
    delete condition[Op.or];
  }
  const { limit, offset } = getPagination(page, size);

  Towers.findAndCountAll({ where: condition, limit, offset, order: orderCon })
    .then(data => {
      const response = getPagingData(data, page, limit);
      res.send(response);
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