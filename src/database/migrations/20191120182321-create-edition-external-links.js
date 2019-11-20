'use strict'

/** @typedef {import('sequelize/lib/query-interface')} QueryInterface */
/** @typedef {import('sequelize/lib/data-types')} DataTypes */

module.exports = {
  /**
   * @param {QueryInterface} queryInterface
   * @param {DataTypes} Sequelize
   */
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('EditionExternalLinks', {
      editionId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Editions',
          key: 'id'
        },
        onDelete: 'CASCADE',
        primaryKey: true
      },
      externalLinkId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'ExternalLinks',
          key: 'id'
        },
        onDelete: 'CASCADE',
        primaryKey: true
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
    return queryInterface.dropTable('EditionExternalLinks')
  }
}
