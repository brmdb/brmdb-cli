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
    await queryInterface.addColumn('Actions', 'uuid', {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4
    })

    const Actions = queryInterface.sequelize.import(
      path.join(__dirname, '../models/action.js')
    )

    const allActions = await Actions.findAll()

    allActions.forEach(async a => {
      await queryInterface.sequelize.query(
        `UPDATE Actions SET uuid='${uuidv4()}' WHERE id = ${a.id};`
      )
    })

    await queryInterface.changeColumn('Actions', 'uuid', {
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
    return queryInterface.removeColumn('Actions', 'uuid')
  }
}
