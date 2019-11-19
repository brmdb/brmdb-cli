'use strict'

const path = require('path')
const uuidv4 = require('uuid/v4')

/** @typedef {import('sequelize/lib/query-interface')} QueryInterface */
/** @typedef {import('sequelize/lib/data-types')} DataTypes */

module.exports = {
  /**
   * @param {QueryInterface} queryInterface
   * @param {DataTypes} Sequelize
   */
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Labels', 'uuid', {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4
    })

    const Label = queryInterface.sequelize.import(
      path.join(__dirname, '../models/label.js')
    )

    const allLabels = await Label.findAll()

    allLabels.forEach(async l => {
      await queryInterface.sequelize.query(
        `UPDATE Labels SET uuid='${uuidv4()}' WHERE id = ${l.id};`
      )
    })

    await queryInterface.changeColumn('Labels', 'uuid', {
      type: Sequelize.UUID,
      allowNull: false,
      defaultValue: Sequelize.UUIDV4
    })
  },

  /**
   * @param {QueryInterface} queryInterface
   * @param {DataTypes} Sequelize
   */
  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('Labels', 'uuid')
  }
}
