'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Publishers', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      bio: {
        type: Sequelize.TEXT
      },
      site: {
        type: Sequelize.STRING,
        allowNull: false
      },
      facebook: {
        type: Sequelize.STRING
      },
      twitter: {
        type: Sequelize.STRING
      },
      instagram: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    })
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Publishers')
  }
}
