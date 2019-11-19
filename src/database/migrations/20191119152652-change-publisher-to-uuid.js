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
    await queryInterface.addColumn('Publishers', 'uuid', {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      allowNull: true
    })

    const Publisher = queryInterface.sequelize.import(
      path.join(__dirname, '../models/publisher.js')
    )

    const allPublishers = await Publisher.findAll()

    allPublishers.forEach(async p => {
      await queryInterface.sequelize.query(
        `UPDATE Publishers SET uuid='${uuidv4()}' WHERE id = ${p.id};`
      )
    })

    await queryInterface.changeColumn('Labels', 'publisherId', {
      allowNull: false,
      type: Sequelize.INTEGER
    })

    await queryInterface.changeColumn('Publishers', 'uuid', {
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
    return queryInterface.removeColumn('Publishers', 'uuid')
  }
}
