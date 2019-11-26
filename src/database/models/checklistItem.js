'use strict'

/** @typedef {import('sequelize/lib/sequelize')} Sequelize */
/** @typedef {import('sequelize/lib/data-types')} DataTypes */

/**
 * @param {Sequelize} sequelize
 * @param {DataTypes} DataTypes
 */
module.exports = (sequelize, DataTypes) => {
  const ChecklistItem = sequelize.define(
    'ChecklistItem',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      checklistId: DataTypes.UUID,
      volumeId: DataTypes.UUID,
      order: DataTypes.NUMBER
    },
    {}
  )

  ChecklistItem.associate = function(models) {
    ChecklistItem.belongsTo(models.Checklist, { as: 'checklist' })
    ChecklistItem.belongsTo(models.Volume, { as: 'volume' })
  }

  return ChecklistItem
}
