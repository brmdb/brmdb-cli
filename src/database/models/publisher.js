'use strict'

const slug = require('slug')

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
      logoUrl: DataTypes.TEXT,
      bannerUrl: DataTypes.TEXT,
      slug: {
        type: DataTypes.VIRTUAL(DataTypes.STRING, ['name']),
        get() {
          return slug(this.name, { charmap: { '&': 'e' }, lower: true })
        }
      }
    },
    {}
  )

  Publisher.associate = function(models) {
    Publisher.hasMany(models.Label, { as: 'labels', foreignKey: 'publisherId' })

    Publisher.belongsToMany(models.ExternalLink, {
      through: 'PublisherExternalLinks',
      as: 'externalLinks',
      foreignKey: 'publisherId',
      otherKey: 'externalLinkId'
    })
  }

  return Publisher
}
