'use strict'

/** @typedef {import('sequelize/lib/query-interface')} QueryInterface */
/** @typedef {import('sequelize/lib/data-types')} DataTypes */

module.exports = {
  /**
   * @param {QueryInterface} queryInterface
   * @param {DataTypes} Sequelize
   */
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Series', {
      id: {
        allowNull: false,
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4
      },
      title: {
        allowNull: false,
        type: Sequelize.STRING
      },
      alternativeTitles: {
        allowNull: false,
        type: Sequelize.TEXT,
        defaultValue: '[]'
      },
      synopsis: {
        type: Sequelize.TEXT
      },
      status: {
        allowNull: false,
        type: Sequelize.ENUM('FINISHED', 'PUBLISHING', 'HIATUS')
      },
      type: {
        allowNull: false,
        type: Sequelize.ENUM(
          'MANGA',
          'MANHWA',
          'MANHUA',
          'MANFRA',
          'NATIONAL',
          'LIGHT_NOVEL',
          'NOVEL',
          'COMIC'
        )
      },
      demografy: {
        allowNull: false,
        type: Sequelize.ENUM(
          'SHOUNEN',
          'SHOUJO',
          'SEINEN',
          'JOSEI',
          'SHOUJO_AI',
          'SHOUNEN_AI',
          'YAOI',
          'YURI',
          'HENTAI'
        )
      },
      genres: {
        allowNull: false,
        type: Sequelize.TEXT,
        defaultValue: '[]'
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
    return queryInterface.dropTable('Series')
  }
}
