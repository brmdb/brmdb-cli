'use strict'

const { dataUrl } = require('../../config/export')

/** @typedef {import('sequelize/lib/sequelize')} Sequelize */
/** @typedef {import('sequelize/lib/data-types')} DataTypes */

/**
 * @param {Sequelize} sequelize
 * @param {DataTypes} DataTypes
 */
module.exports = (sequelize, DataTypes) => {
  const Volume = sequelize.define(
    'Volume',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      number: DataTypes.STRING,
      name: DataTypes.TEXT,
      synopsis: DataTypes.TEXT,
      isbn: DataTypes.STRING,
      issn: DataTypes.STRING,
      price: DataTypes.FLOAT,
      releaseDate: DataTypes.DATE,
      extras: { type: DataTypes.TEXT, defaultValue: '[]' },
      editionId: DataTypes.UUID,
      extrasArray: {
        type: new DataTypes.VIRTUAL(DataTypes.STRING, ['extras']),
        get() {
          return JSON.parse(this.extras)
        },
        set(val) {
          this.setDataValue('extrasArray', val)
          this.setDataValue('extras', JSON.stringify(val))
        }
      },
      coverUrl: {
        type: DataTypes.VIRTUAL(DataTypes.STRING, ['id']),
        get() {
          return `${dataUrl}/volumes/images/${this.id}.jpg`
        }
      }
    },
    {}
  )

  Volume.associate = function(models) {
    Volume.belongsTo(models.Edition, { as: 'edition' })
    Volume.hasMany(models.VolumePerson, {
      as: 'involvedPeople',
      foreignKey: 'volumeId'
    })
  }

  return Volume
}
