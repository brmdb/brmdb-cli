const flatMap = require('lodash.flatmap')
const {
  strings: { startCase, lowerCase }
} = require('gluegun/strings')

module.exports = series => [
  {
    type: 'autocomplete',
    name: 'editionId',
    message: 'From what edition is this volume?',
    choices: flatMap(
      series.map(s => ({ title: s.title, type: s.type, editions: s.editions })),
      ({ title, type, editions }) =>
        editions.map(e => ({
          name: e.id.toString(),
          message: `${title}${
            type === 'MANGA' ? '' : ` (${startCase(lowerCase(type))})`
          } - ${e.name}`,
          value: e.id.toString()
        }))
    )
  },
  {
    type: 'input',
    name: 'number',
    message: 'What is the volume number?'
  },
  {
    type: 'input',
    name: 'name',
    message: 'What is the volume name?'
  },
  {
    type: 'editor',
    name: 'synopsis',
    message: 'What is the volume synopsis?',
    extension: 'md'
  },
  {
    type: 'select',
    name: 'registerType',
    message: 'What register does the volume have?',
    choices: [
      {
        name: 'ISBN',
        message: 'ISBN - International Standard Book Number',
        value: 'ISBN'
      },
      {
        name: 'ISSN',
        message: 'ISSN - International Standard Serial Number',
        value: 'ISSN'
      }
    ]
  },
  {
    type: 'input',
    name: 'isbn',
    message: 'What is the ISBN?',
    skip() {
      return this.state.answers.registerType === 'ISSN'
    }
  },
  {
    type: 'input',
    name: 'issn',
    message: 'What is the ISSN?',
    skip() {
      return this.state.answers.registerType === 'ISBN'
    }
  },
  {
    type: 'numeral',
    name: 'price',
    message: 'What is the price of the volume? R$'
  },
  {
    type: 'input',
    name: 'releaseDate',
    message: 'What is the release date of the volume? (yyyy-mm-dd)'
  },
  {
    type: 'list',
    name: 'extrasArray',
    message: 'If the volume have promotional gifts, list them:',
    separator: /\| */
  },
  {
    type: 'input',
    name: 'coverUrl',
    message: 'What is the url of the cover image?'
  }
]
