'use strict'

/** @typedef {import('sequelize/lib/query-interface')} QueryInterface */
/** @typedef {import('sequelize/lib/data-types')} DataTypes */

module.exports = {
  /**
   * @param {QueryInterface} queryInterface
   * @param {DataTypes} Sequelize
   */
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Actions', 'id')
    await queryInterface.renameColumn('Actions', 'uuid', 'id')
    await queryInterface.changeColumn('Actions', 'id', {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      allowNull: false,
      primaryKey: true
    })

    await queryInterface.removeColumn('Labels', 'id')
    await queryInterface.renameColumn('Labels', 'uuid', 'id')
    await queryInterface.changeColumn('Labels', 'id', {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      allowNull: false,
      primaryKey: true
    })

    await queryInterface.removeColumn('Publishers', 'id')
    await queryInterface.renameColumn('Publishers', 'uuid', 'id')
    await queryInterface.changeColumn('Publishers', 'id', {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      allowNull: false,
      primaryKey: true
    })
  },

  /**
   * @param {QueryInterface} queryInterface
   * @param {DataTypes} Sequelize
   */
  down: (queryInterface, Sequelize) => {
    console.error("CAN'T UNDO")
  }
}
