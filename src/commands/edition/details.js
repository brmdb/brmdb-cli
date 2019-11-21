module.exports = {
  name: 'details',
  description: 'Show the details from a edition in the database',
  run: async toolbox => {
    const {
      parameters,
      print: { tabulateInstance, listInstances, error },
      db: { sequelize, ExternalLink, Edition, Volume }
    } = toolbox

    if (!parameters.first) {
      error('You need to specify an id.')
      return
    }

    const edition = await Edition.findOne({
      include: [
        { model: ExternalLink, as: 'externalLinks' },
        { model: Volume, as: 'volumes' }
      ],
      order: [
        [sequelize.literal('volumes.number * 1')],
        [sequelize.literal('volumes.number')]
      ],
      where: { id: parameters.first }
    })
    if (!edition) {
      error(`A edition with id ${parameters.first} does not exists.`)
      return
    }

    tabulateInstance(edition)

    if (edition.externalLinks.length) {
      listInstances(
        edition.externalLinks,
        ['id', 'name', 'type', 'url'],
        [38, 22, 14, 30]
      )
    }

    if (edition.volumes.length) {
      listInstances(edition.volumes, [
        'id',
        'number',
        'name',
        'isbn',
        'issn',
        'price',
        'releaseDate'
      ])
    }
  }
}
