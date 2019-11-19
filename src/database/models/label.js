'use strict'

const { dataUrl } = require('../../config/export')

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
      logoUrl: {
        type: new DataTypes.VIRTUAL(DataTypes.STRING, ['id']),
        get() {
          return `${dataUrl}/labels/images/${this.id}.png`
        }
      }
    },
    {}
  )

  Label.associate = function(models) {
    Label.belongsTo(models.Publisher, { as: 'publisher' })
  }

  return Label
}
