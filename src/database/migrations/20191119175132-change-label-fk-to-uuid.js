'use strict'

const path = require('path')

/** @typedef {import('sequelize/lib/query-interface')} QueryInterface */
/** @typedef {import('sequelize/lib/data-types')} DataTypes */

module.exports = {
  /**
   * @param {QueryInterface} queryInterface
   * @param {DataTypes} Sequelize
   */
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Labels', 'publisheruuid', {
      type: Sequelize.UUID
    })

    const Label = queryInterface.sequelize.import(
      path.join(__dirname, '../models/label.js')
    )

    const allLabels = await Label.findAll()

    allLabels.forEach(async l => {
      await queryInterface.sequelize.query(`
        UPDATE Labels
        SET publisheruuid=(SELECT Publishers.uuid FROM Publishers, Labels
                           WHERE Publishers.id = Labels.publisherId
                             AND Labels.id = ${l.id})
        WHERE id = ${l.id};
      `)
    })

    await queryInterface.removeColumn('Labels', 'publisherId')
    await queryInterface.renameColumn('Labels', 'publisheruuid', 'publisherId')

    await queryInterface.changeColumn('Labels', 'publisherId', {
      type: Sequelize.UUID,
      allowNull: false
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
