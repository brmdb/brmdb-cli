'use strict'

/** @typedef {import('sequelize/lib/sequelize')} Sequelize */
/** @typedef {import('sequelize/lib/data-types')} DataTypes */

/**
 * @param {Sequelize} sequelize
 * @param {DataTypes} DataTypes
 */
module.exports = (sequelize, DataTypes) => {
  const Edition = sequelize.define(
    'Edition',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      name: DataTypes.STRING,
      type: DataTypes.ENUM('NORMAL', 'DELUXE'),
      paper: DataTypes.STRING,
      cover: DataTypes.ENUM('SOFT', 'HARD'),
      bindingType: DataTypes.ENUM(
        'CASE_BOUND',
        'PERFECT_BOUND',
        'SADDLE_STITCHED'
      ),
      dimensions: DataTypes.STRING,
      hasJacket: DataTypes.BOOLEAN,
      status: DataTypes.ENUM(
        'ANNOUNCED',
        'PUBLISHING',
        'FINISHED',
        'CANCELLED',
        'HIATUS',
        'UNKNOWN'
      ),
      period: DataTypes.ENUM(
        'MONTHLY',
        'BIMONTHLY',
        'TRIMONTHLY',
        'QUADRIMONTHLY',
        'UNDEFINED'
      ),
      startDate: DataTypes.DATE,
      endDate: DataTypes.DATE,
      labelId: DataTypes.UUID,
      serieId: DataTypes.UUID
    },
    {}
  )

  Edition.associate = function(models) {
    Edition.belongsTo(models.Label, { as: 'label' })
    Edition.belongsTo(models.Serie, { as: 'serie' })
    Edition.belongsToMany(models.ExternalLink, {
      through: 'EditionExternalLinks',
      as: 'externalLinks',
      foreignKey: 'editionId',
      otherKey: 'externalLinkId'
    })
  }

  return Edition
}
