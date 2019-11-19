'use strict'

const { dataUrl } = require('../../config/export')

/** @typedef {import('sequelize/lib/sequelize')} Sequelize */
/** @typedef {import('sequelize/lib/data-types')} DataTypes */

/**
 * @param {Sequelize} sequelize
 * @param {DataTypes} DataTypes
 */
module.exports = (sequelize, DataTypes) => {
  const Publisher = sequelize.define(
    'Publisher',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      name: DataTypes.STRING,
      bio: DataTypes.TEXT,
      site: DataTypes.STRING,
      facebook: DataTypes.STRING,
      twitter: DataTypes.STRING,
      instagram: DataTypes.STRING,
      logoUrl: {
        type: DataTypes.VIRTUAL(DataTypes.STRING, ['id']),
        get() {
          return `${dataUrl}/publishers/images/${this.id}.png`
        }
      }
    },
    {}
  )

  Publisher.associate = function(models) {
    Publisher.hasMany(models.Label, { as: 'labels', foreignKey: 'publisherId' })
  }

  return Publisher
}
