'use strict'

/** @typedef {import('sequelize/lib/sequelize')} Sequelize */
/** @typedef {import('sequelize/lib/data-types')} DataTypes */

/**
 * @param {Sequelize} sequelize
 * @param {DataTypes} DataTypes
 */
module.exports = (sequelize, DataTypes) => {
  const Label = sequelize.define(
    'Label',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      name: DataTypes.STRING,
      description: DataTypes.STRING,
      logoUrl: DataTypes.TEXT
    },
    {}
  )

  Label.associate = function(models) {
    Label.belongsTo(models.Publisher, { as: 'publisher' })
    Label.hasMany(models.Edition, {
      as: 'editionsReleased',
      foreignKey: 'labelId'
    })
  }

  return Label
}
