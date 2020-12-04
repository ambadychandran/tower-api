'use strict';
const bcrypt = require('bcrypt');
const pwd_dflt = bcrypt.hashSync('admin', 10);

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('users', [{
      first_name : 'Ambady',
      last_name : 'Chandran',
      user_name : 'admin',
      password : pwd_dflt,
      status : 	true,
      createdAt : new Date(),
      updatedAt : new Date()
    }], {});
  },

  down: async (queryInterface, Sequelize) => {
  
  }
};
