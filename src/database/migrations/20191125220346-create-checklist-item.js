'use strict'

/** @typedef {import('sequelize/lib/query-interface')} QueryInterface */
/** @typedef {import('sequelize/lib/data-types')} DataTypes */

module.exports = {
  /**
   * @param {QueryInterface} queryInterface
   * @param {DataTypes} Sequelize
   */
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('ChecklistItems', {
      id: {
        type: Sequelize.UUID,
        allowNull: false,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      checklistId: {
        allowNull: false,
        type: Sequelize.UUID,
        references: {
          model: 'Checklists',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      volumeId: {
        allowNull: false,
        type: Sequelize.UUID,
        references: {
          model: 'Volumes',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      order: {
        allowNull: false,
        type: Sequelize.NUMBER
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
    return queryInterface.dropTable('ChecklistItems')
  }
}
