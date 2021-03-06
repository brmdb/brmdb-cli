'use strict'

const slug = require('slug')

/** @typedef {import('sequelize/lib/sequelize')} Sequelize */
/** @typedef {import('sequelize/lib/data-types')} DataTypes */

/**
 * @param {Sequelize} sequelize
 * @param {DataTypes} DataTypes
 */
module.exports = (sequelize, DataTypes) => {
  const Serie = sequelize.define(
    'Serie',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      title: DataTypes.TEXT,
      alternativeTitles: { type: DataTypes.TEXT, defaultValue: '[]' },
      synopsis: DataTypes.TEXT,
      status: DataTypes.ENUM('FINISHED', 'PUBLISHING', 'HIATUS'),
      type: DataTypes.ENUM(
        'MANGA',
        'MANHWA',
        'MANHUA',
        'MANFRA',
        'NATIONAL',
        'LIGHT_NOVEL',
        'NOVEL',
        'COMIC'
      ),
      demografy: DataTypes.ENUM(
        'SHOUNEN',
        'SHOUJO',
        'SEINEN',
        'JOSEI',
        'SHOUJO_AI',
        'SHOUNEN_AI',
        'YAOI',
        'YURI',
        'HENTAI'
      ),
      genres: { type: DataTypes.TEXT, defaultValue: '[]' },
      bannerUrl: DataTypes.TEXT,
      posterUrl: DataTypes.TEXT,
      synonyms: {
        type: new DataTypes.VIRTUAL(DataTypes.STRING, ['alternativeTitles']),
        get() {
          return JSON.parse(this.alternativeTitles)
        },
        set(val) {
          this.setDataValue('synonyms', val)
          this.setDataValue('alternativeTitles', JSON.stringify(val))
        }
      },
      genresArray: {
        type: new DataTypes.VIRTUAL(DataTypes.STRING, ['genres']),
        get() {
          return JSON.parse(this.genres)
        },
        set(val) {
          this.setDataValue('genresArray', val)
          this.setDataValue('genres', JSON.stringify(val))
        }
      },
      slug: {
        type: DataTypes.VIRTUAL(DataTypes.STRING, ['title', 'type']),
        get() {
          return slug(
            this.title +
              (this.type === 'MANGA' ? '' : ' ' + this.type.replace('_', ' ')),
            { lower: true }
          )
        }
      }
    },
    {}
  )

  Serie.associate = function(models) {
    Serie.belongsToMany(models.ExternalLink, {
      through: 'SerieExternalLinks',
      as: 'externalLinks',
      foreignKey: 'serieId',
      otherKey: 'externalLinkId'
    })

    Serie.hasMany(models.SeriePerson, { foreignKey: 'serieId', as: 'creators' })
    Serie.hasMany(models.Edition, { foreignKey: 'serieId', as: 'editions' })
  }

  return Serie
}
