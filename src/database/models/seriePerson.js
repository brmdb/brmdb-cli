'use strict'

/** @typedef {import('sequelize/lib/sequelize')} Sequelize */
/** @typedef {import('sequelize/lib/data-types')} DataTypes */

/**
 * @param {Sequelize} sequelize
 * @param {DataTypes} DataTypes
 */
module.exports = (sequelize, DataTypes) => {
  const SeriePerson = sequelize.define(
    'SeriePerson',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      serieId: DataTypes.UUID,
      personId: DataTypes.UUID,
      role: DataTypes.STRING
    },
    {}
  )

  SeriePerson.associate = function(models) {
    SeriePerson.belongsTo(models.Serie, { foreignKey: 'serieId', as: 'serie' })
    SeriePerson.belongsTo(models.Person, {
      foreignKey: 'personId',
      as: 'person'
    })
  }

  return SeriePerson
}
