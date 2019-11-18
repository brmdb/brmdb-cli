'use strict'

/** @typedef {import('sequelize/lib/query-interface')} QueryInterface */
/** @typedef {import('sequelize/lib/data-types')} DataTypes */

module.exports = {
  /**
   * @param {QueryInterface} queryInterface
   * @param {DataTypes} Sequelize
   */
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Labels', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        allowNull: false,
        type: Sequelize.STRING
      },
      description: {
        allowNull: false,
        type: Sequelize.STRING
      },
      publisherId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'Publishers',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
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

  /**
   * @param {QueryInterface} queryInterface
   * @param {DataTypes} Sequelize
   */
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Labels')
  }
}
