'use strict'

/** @typedef {import('sequelize/lib/sequelize')} Sequelize */
/** @typedef {import('sequelize/lib/data-types')} DataTypes */

/**
 * @param {Sequelize} sequelize
 * @param {DataTypes} DataTypes
 */
module.exports = (sequelize, DataTypes) => {
  const SeriePerson = sequelize.define(
    'VolumePerson',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      volumeId: DataTypes.UUID,
      personId: DataTypes.UUID,
      role: DataTypes.STRING
    },
    {}
  )

  SeriePerson.associate = function(models) {
    SeriePerson.belongsTo(models.Volume, {
      foreignKey: 'volumeId',
      as: 'volume'
    })
    SeriePerson.belongsTo(models.Person, {
      foreignKey: 'personId',
      as: 'person'
    })
  }

  return SeriePerson
}
