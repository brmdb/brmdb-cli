'use strict'

/** @typedef {import('sequelize/lib/sequelize')} Sequelize */
/** @typedef {import('sequelize/lib/data-types')} DataTypes */

/**
 * @param {Sequelize} sequelize
 * @param {DataTypes} DataTypes
 */
module.exports = (sequelize, DataTypes) => {
  const Checklist = sequelize.define(
    'Checklist',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      month: DataTypes.NUMBER,
      year: DataTypes.NUMBER,
      observation: DataTypes.TEXT,
      labelId: DataTypes.UUID
    },
    {}
  )

  Checklist.associate = function(models) {
    Checklist.belongsTo(models.Label, { as: 'label' })
    Checklist.hasMany(models.ChecklistItem, {
      foreignKey: 'checklistId',
      as: 'items'
    })
  }

  return Checklist
}
