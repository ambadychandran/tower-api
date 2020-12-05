const db = require("../models");
const cache = require('../cache');
const Towers = db.towers;
const Op = db.Sequelize.Op;
const sequelize = require('sequelize');

const getPagingData = (data, page, limit) => {
  const { count: totalItems, rows: towers } = data;
  const currentPage = page ? +page : 0;
  const totalPages = Math.ceil(totalItems / limit);
  return { totalItems, towers, totalPages, currentPage };
};

const getPagination = (page, size) => {
  const limit = size ? +size : 3;
  const offset = page ? page * limit : 0;
  return { limit, offset };
};

//generate the cache key from query params
const getCacheKey = (quryData) => {
   let ckey = quryData.size ? quryData.size : '';
        ckey += quryData.page ? quryData.page : '';
        ckey += quryData.orderby ? quryData.orderby : '';
        ckey += quryData.sort ? quryData.sort : '';
        ckey += quryData.page ? quryData.page : '';
        ckey += quryData.name ? quryData.name : '';
        ckey += quryData.rating ? quryData.rating : '';
        ckey += quryData.location ? quryData.location : '';
        ckey += quryData.number_of_floors ? quryData.number_of_floors : '';
        ckey += quryData.latitude ? quryData.latitude : '';
        ckey += quryData.longitude ? quryData.longitude : '';
   return ckey;
};

// Create and Save a new Towers
exports.create = (io,req, res) => {
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
      cache.del('towers');
      io.emit('message', 'new data added');
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
  let cacheKey = getCacheKey(req.query);

  cache.hget('towers',cacheKey, (err, data) => {
    
    if (data !== null) {
      let towers = JSON.parse(data);
      //If it does, return data
      res.send(towers);
      return;
    }
    const { page, size, name, rating, location, number_of_floors, orderby, sort ,number_of_offices,latitude,longitude} = req.query;
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
        number_of_offices ? { number_of_offices: { [Op.like]: `%${number_of_offices}%` } } : null,
        latitude ? { 	latitude: { [Op.like]: `%${latitude}%` } } : null,
        longitude ? { 	longitude: { [Op.like]: `%${longitude}%` } } : null,
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

        cache.hset('towers',cacheKey,JSON.stringify(response), () => {
          res.send(response);
        })
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving towers."
        });
      });
  })
  
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
exports.update = (io ,req, res) => {
  const id = req.params.id;
  Towers.update(req.body, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        cache.del('towers');
        io.emit('message', 'data updated');
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
        cache.del('towers');
        io.emit('message', 'data deleted');
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

// Search a tower
exports.search = (req, res) => {
  let cacheKey = getCacheKey(req.query);

  cache.hget('towers',cacheKey, (err, data) => {
    if (data !== null) {
      let towers = JSON.parse(data);
      //If it does, return data
      res.send(towers);
      return;
    }
    const {  name, rating, location, number_of_floors, orderby, sort ,number_of_offices,latitude,longitude} = req.query;
    var condition =
    {
      [Op.or]: [
        name ? { name: { [Op.like]: `%${name}%` } } : null,
        rating ? { rating: { [Op.like]: `%${rating}%` } } : null,
        location ? { location: { [Op.like]: `%${location}%` } } : null,
        number_of_floors ? { number_of_floors: { [Op.like]: `%${number_of_floors}%` } } : null,
        number_of_offices ? { number_of_offices: { [Op.like]: `%${number_of_offices}%` } } : null,
        latitude ? { 	latitude: { [Op.like]: `%${latitude}%` } } : null,
        longitude ? { 	longitude: { [Op.like]: `%${longitude}%` } } : null,
      ]
    }
    if (name == null && rating == null && location == null && number_of_floors == null) {
      delete condition[Op.or];
    }

    Towers.findAll({ where: condition })
      .then(data => {
        cache.hset('towers',cacheKey,JSON.stringify(data), () => {
          res.send(data);
        })
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving towers."
        });
      });
  })
  
};