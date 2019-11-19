'use strict'

/** @typedef {import('sequelize/lib/sequelize')} Sequelize */
/** @typedef {import('sequelize/lib/data-types')} DataTypes */

/**
 * @param {Sequelize} sequelize
 * @param {DataTypes} DataTypes
 */
module.exports = (sequelize, DataTypes) => {
  const ExternalLink = sequelize.define(
    'ExternalLink',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      name: DataTypes.STRING,
      type: DataTypes.ENUM('SOCIAL', 'DATABASE', 'INFORMATION', 'STORE'),
      url: DataTypes.STRING
    },
    {}
  )

  ExternalLink.associate = function(models) {
    ExternalLink.belongsToMany(models.Person, {
      through: 'PersonExternalLinks',
      as: 'people',
      foreignKey: 'externalLinkId',
      otherKey: 'personId'
    })

    ExternalLink.belongsToMany(models.Publisher, {
      through: 'PublisherExternalLinks',
      as: 'publishers',
      foreignKey: 'externalLinkId',
      otherKey: 'publisherId'
    })
  }

  return ExternalLink
}
