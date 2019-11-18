'use strict'

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
      name: DataTypes.STRING,
      bio: DataTypes.TEXT,
      site: DataTypes.STRING,
      facebook: DataTypes.STRING,
      twitter: DataTypes.STRING,
      instagram: DataTypes.STRING
    },
    {}
  )

  Publisher.associate = function(models) {
    Publisher.hasMany(models.Label, { as: 'labels', foreignKey: 'publisherId' })
  }

  return Publisher
}
