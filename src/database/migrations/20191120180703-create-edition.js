'use strict'

/** @typedef {import('sequelize/lib/query-interface')} QueryInterface */
/** @typedef {import('sequelize/lib/data-types')} DataTypes */

module.exports = {
  /**
   * @param {QueryInterface} queryInterface
   * @param {DataTypes} Sequelize
   */
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Editions', {
      id: {
        type: Sequelize.UUID,
        allowNull: false,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      name: {
        allowNull: false,
        type: Sequelize.STRING
      },
      type: {
        allowNull: false,
        type: Sequelize.ENUM('NORMAL', 'DELUXE')
      },
      paper: {
        allowNull: false,
        type: Sequelize.STRING
      },
      cover: {
        allowNull: false,
        type: Sequelize.ENUM('SOFT', 'HARD')
      },
      bindingType: {
        allowNull: false,
        type: Sequelize.ENUM('CASE_BOUND', 'PERFECT_BOUND', 'SADDLE_STITCHED')
      },
      dimensions: {
        allowNull: false,
        type: Sequelize.STRING
      },
      hasJacket: {
        allowNull: false,
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      status: {
        allowNull: false,
        type: Sequelize.ENUM(
          'ANNOUNCED',
          'PUBLISHING',
          'FINISHED',
          'CANCELLED',
          'HIATUS',
          'UNKNOWN'
        )
      },
      period: {
        allowNull: false,
        type: Sequelize.ENUM(
          'MONTHLY',
          'BIMONTHLY',
          'TRIMONTHLY',
          'QUADRIMONTHLY',
          'UNDEFINED'
        )
      },
      startDate: {
        type: Sequelize.DATE
      },
      endDate: {
        type: Sequelize.DATE
      },
      labelId: {
        allowNull: false,
        type: Sequelize.UUID,
        references: {
          model: 'Labels',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      serieId: {
        allowNull: false,
        type: Sequelize.UUID,
        references: {
          model: 'Series',
          key: 'id'
        },
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
    return queryInterface.dropTable('Editions')
  }
}
