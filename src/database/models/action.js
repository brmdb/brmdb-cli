'use strict'

/** @typedef {import('sequelize/lib/sequelize')} Sequelize */
/** @typedef {import('sequelize/lib/data-types')} DataTypes */

/**
 * @param {Sequelize} sequelize
 * @param {DataTypes} DataTypes
 */
module.exports = (sequelize, DataTypes) => {
  const Action = sequelize.define(
    'Action',
    {
      model: DataTypes.STRING,
      referer: DataTypes.INTEGER,
      action: DataTypes.STRING,
      contributor: DataTypes.STRING
    },
    {}
  )
  Action.associate = function(models) {
    // associations can be defined here
  }
  Action.types = { CREATE: 'create', UPDATE: 'update', DELETE: 'delete' }
  return Action
}
