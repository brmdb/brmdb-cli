'use strict'

/** @typedef {import('sequelize/lib/sequelize')} Sequelize */
/** @typedef {import('sequelize/lib/data-types')} DataTypes */

/**
 * @param {Sequelize} sequelize
 * @param {DataTypes} DataTypes
 */
module.exports = (sequelize, DataTypes) => {
  const Person = sequelize.define(
    'Person',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      name: DataTypes.STRING,
      bio: DataTypes.STRING
    },
    {}
  )

  Person.associate = function(models) {
    Person.belongsToMany(models.ExternalLink, {
      through: 'PersonExternalLinks',
      as: 'externalLinks',
      foreignKey: 'personId',
      otherKey: 'externalLinkId'
    })

    // Person.belongsToMany(models.Serie, {
    //   through: models.SeriePerson,
    //   as: 'works',
    //   foreignKey: 'personId'
    // })
    Person.hasMany(models.SeriePerson, { foreignKey: 'personId', as: 'works' })
  }

  return Person
}
