'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Towers extends Model {

    static associate(models) {
    }
  };
  Towers.init({
    name: DataTypes.STRING,
    location: DataTypes.STRING,
    number_of_floors: DataTypes.INTEGER,
    number_of_offices: DataTypes.INTEGER,
    rating: DataTypes.INTEGER,
    latitude: DataTypes.STRING,
    longitude: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'towers',
  });
  return Towers;
};