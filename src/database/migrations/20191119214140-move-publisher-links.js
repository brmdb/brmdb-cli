'use strict'

const path = require('path')

/** @typedef {import('sequelize/lib/query-interface')} QueryInterface */
/** @typedef {import('sequelize/lib/data-types')} DataTypes */

module.exports = {
  /**
   * @param {QueryInterface} queryInterface
   * @param {DataTypes} Sequelize
   */
  up: async (queryInterface, Sequelize) => {
    const columns = ['facebook', 'twitter', 'instagram']
    const urls = {
      facebook: 'https://facebook.com/',
      twitter: 'https://twitter.com/',
      instagram: 'https://instagram.com/'
    }

    const Publisher = queryInterface.sequelize.import(
      path.resolve(__dirname, '../models/publisher.js')
    )
    const ExternalLink = queryInterface.sequelize.import(
      path.resolve(__dirname, '../models/externalLink.js')
    )
    const Label = queryInterface.sequelize.import(
      path.resolve(__dirname, '../models/label.js')
    )
    Publisher.associate({ ExternalLink, Label })

    const allPublishers = await Publisher.findAll()
    for (const publisher of allPublishers) {
      const linksCreated = []

      for (const attribute of columns) {
        if (publisher[attribute].length > 0) {
          const link = await ExternalLink.create({
            name: attribute.replace(/\b[a-z]/g, x => x.toUpperCase()),
            type: 'SOCIAL',
            url: urls[attribute] + publisher[attribute]
          })

          linksCreated.push(link)
        }
      }

      for (const linkCreated of linksCreated) {
        publisher.addExternalLink(linkCreated)
      }
    }
  },

  /**
   * @param {QueryInterface} queryInterface
   * @param {DataTypes} Sequelize
   */
  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query(`DELETE FROM PublisherExternalLinks;`)
  }
}
