'use strict'

/** @typedef {import('sequelize/lib/query-interface')} QueryInterface */
/** @typedef {import('sequelize/lib/data-types')} DataTypes */

module.exports = {
  /**
   * @param {QueryInterface} queryInterface
   * @param {DataTypes} Sequelize
   */
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('PublisherExternalLinksNew', {
      publisherId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Publishers',
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
    await queryInterface.sequelize.query(`
      INSERT INTO PublisherExternalLinksNew (publisherId, externalLinkId, createdAt, updatedAt)
        SELECT publisherId, externalLinkId, createdAt, updatedAt FROM PublisherExternalLinks;
    `)
    await queryInterface.dropTable('PublisherExternalLinks')
    await queryInterface.renameTable(
      'PublisherExternalLinksNew',
      'PublisherExternalLinks'
    )
  },

  /**
   * @param {QueryInterface} queryInterface
   * @param {DataTypes} Sequelize
   */
  down: (queryInterface, Sequelize) => {
    console.error("CAN'T UNDO")
  }
}
