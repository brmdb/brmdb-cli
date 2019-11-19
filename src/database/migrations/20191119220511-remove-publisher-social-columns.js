'use strict'

/** @typedef {import('sequelize/lib/query-interface')} QueryInterface */
/** @typedef {import('sequelize/lib/data-types')} DataTypes */

module.exports = {
  /**
   * @param {QueryInterface} queryInterface
   * @param {DataTypes} Sequelize
   */
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('Labels', 'publisherId', {
      type: Sequelize.UUID,
      allowNull: false
    })
    await queryInterface.changeColumn('PublisherExternalLinks', 'publisherId', {
      type: Sequelize.UUID,
      allowNull: false
    })
    await queryInterface.removeColumn('Publishers', 'facebook')
    await queryInterface.removeColumn('Publishers', 'twitter')
    await queryInterface.removeColumn('Publishers', 'instagram')
    await queryInterface.changeColumn('Labels', 'publisherId', {
      allowNull: false,
      type: Sequelize.UUID,
      references: {
        model: 'Publishers',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    })
  },

  /**
   * @param {QueryInterface} queryInterface
   * @param {DataTypes} Sequelize
   */
  down: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Publishers', 'facebook', {
      type: Sequelize.STRING
    })
    await queryInterface.addColumn('Publishers', 'twitter', {
      type: Sequelize.STRING
    })
    await queryInterface.addColumn('Publishers', 'instagram', {
      type: Sequelize.STRING
    })
  }
}
