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
      name: DataTypes.STRING,
      description: DataTypes.STRING
    },
    {}
  )

  Label.associate = function(models) {
    Label.belongsTo(models.Publisher, { as: 'publisher' })
  }

  return Label
}
