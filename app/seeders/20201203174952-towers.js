'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('towers', [{
      name: 'Lake View',
      location: 'Jumeirah Lakes Towers',
      number_of_floors: 20,
      number_of_offices: 5,
      rating: 5,
      latitude: 25.276987,
      longitude: 55.296249,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: 'Lake Terrace Tower',
      location: 'Jumeirah Lakes Towers',
      number_of_floors: 10,
      number_of_offices: 4,
      rating: 3,
      latitude: 25.276987,
      longitude: 55.296249,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: 'Madina Tower',
      location: 'Jumeirah Lakes Towers',
      number_of_floors: 15,
      number_of_offices: 1,
      rating: 2,
      latitude: 25.276987,
      longitude: 55.296249,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: 'Armada Tower',
      location: 'Jumeirah Lakes Towers',
      number_of_floors: 14,
      number_of_offices: 9,
      rating: 4,
      latitude: 25.276987,
      longitude: 55.296249,
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});
  },

  down: async (queryInterface, Sequelize) => {

  }
};
