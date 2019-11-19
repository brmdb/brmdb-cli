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
    await queryInterface.addColumn('Actions', 'refereruuid', {
      type: Sequelize.UUID
    })

    const Action = queryInterface.sequelize.import(
      path.join(__dirname, '../models/action.js')
    )

    const allActions = await Action.findAll()

    allActions.forEach(async a => {
      await queryInterface.sequelize.query(`
        UPDATE Actions
        SET refereruuid=(SELECT ${a.model}s.uuid FROM ${a.model}s, Actions
                         WHERE ${a.model}s.id = Actions.referer
                           AND Actions.id = ${a.id})
        WHERE id = ${a.id};
      `)
    })

    await queryInterface.removeColumn('Actions', 'referer')
    await queryInterface.renameColumn('Actions', 'refereruuid', 'referer')

    await queryInterface.changeColumn('Actions', 'referer', {
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
