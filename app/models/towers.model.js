module.exports = (sequelize, Sequelize) => {
  const Towers = sequelize.define("towers", {
    name: {
      type: Sequelize.STRING
    },
    location: {
      type: Sequelize.STRING
    },
    number_of_floors: {
      type: Sequelize.INTEGER
    },
    rating: {
      type: Sequelize.INTEGER
    },
    latitude: {
      type: Sequelize.DECIMAL
    },
    longitude: {
      type: Sequelize.DECIMAL
    }
  });

  return Towers;
};
