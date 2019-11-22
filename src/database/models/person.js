'use strict'

const slug = require('slug')

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
      bio: DataTypes.STRING,
      slug: {
        type: DataTypes.VIRTUAL(DataTypes.STRING, ['name']),
        get() {
          return slug(this.name, { lower: true })
        }
      }
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

    Person.hasMany(models.SeriePerson, { foreignKey: 'personId', as: 'works' })
    Person.hasMany(models.VolumePerson, { foreignKey: 'personId', as: 'roles' })
  }

  return Person
}
