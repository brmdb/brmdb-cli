'use strict'

/** @typedef {import('sequelize/lib/query-interface')} QueryInterface */
/** @typedef {import('sequelize/lib/data-types')} DataTypes */

module.exports = {
  /**
   * @param {QueryInterface} queryInterface
   * @param {DataTypes} Sequelize
   */
  up: async (queryInterface, Sequelize) => {
    // ACTIONS.
    await queryInterface.createTable('ActionsNew', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true
      },
      model: {
        allowNull: false,
        type: Sequelize.STRING
      },
      referer: {
        allowNull: false,
        type: Sequelize.UUID
      },
      action: {
        allowNull: false,
        type: Sequelize.STRING
      },
      contributor: {
        allowNull: false,
        type: Sequelize.STRING
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
      INSERT INTO ActionsNew (id, model, referer, action, contributor, createdAt, updatedAt)
        SELECT id, model, referer, action, contributor, createdAt, updatedAt FROM Actions;
    `)
    await queryInterface.dropTable('Actions')
    await queryInterface.renameTable('ActionsNew', 'Actions')

    // LABELS.
    await queryInterface.createTable('LabelsNew', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true
      },
      name: {
        allowNull: false,
        type: Sequelize.STRING
      },
      description: {
        allowNull: false,
        type: Sequelize.STRING
      },
      publisherId: {
        allowNull: false,
        type: Sequelize.UUID
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
      INSERT INTO LabelsNew (id, name, description, publisherId, createdAt, updatedAt)
        SELECT id, name, description, publisherId, createdAt, updatedAt FROM Labels;
    `)
    await queryInterface.dropTable('Labels')
    await queryInterface.renameTable('LabelsNew', 'Labels')

    // PUBLISHERS.
    await queryInterface.createTable('PublishersNew', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      bio: {
        type: Sequelize.TEXT
      },
      site: {
        type: Sequelize.STRING,
        allowNull: false
      },
      facebook: {
        type: Sequelize.STRING
      },
      twitter: {
        type: Sequelize.STRING
      },
      instagram: {
        type: Sequelize.STRING
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
      INSERT INTO PublishersNew (id, name, bio, site, facebook, twitter, instagram, createdAt, updatedAt)
        SELECT id, name, bio, site, facebook, twitter, instagram, createdAt, updatedAt FROM Publishers;
    `)
    await queryInterface.dropTable('Publishers')
    await queryInterface.renameTable('PublishersNew', 'Publishers')
  },

  /**
   * @param {QueryInterface} queryInterface
   * @param {DataTypes} Sequelize
   */
  down: (queryInterface, Sequelize) => {
    console.error("CAN'T UNDO")
  }
}
