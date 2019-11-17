'use strict'

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
    // associations can be defined here
  }
  return Publisher
}
