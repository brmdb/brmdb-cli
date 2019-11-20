module.exports = {
  name: 'details',
  description: 'Show the details from a publisher in the database',
  run: async toolbox => {
    const {
      parameters,
      print: { tabulateInstance, listInstances, error },
      db: { ExternalLink, Publisher, Label }
    } = toolbox

    if (!parameters.first) {
      error('You need to specify an id.')
      return
    }

    const publisher = await Publisher.findOne({
      include: [
        { model: ExternalLink, as: 'externalLinks' },
        { model: Label, as: 'labels' }
      ],
      where: { id: parameters.first }
    })
    if (!publisher) {
      error(`A publisher with id ${parameters.first} does not exists.`)
      return
    }

    tabulateInstance(publisher, ['bio'])

    if (publisher.externalLinks.length) {
      listInstances(
        publisher.externalLinks,
        ['id', 'name', 'type', 'url'],
        [38, 22, 14, 30]
      )
    }

    if (publisher.labels.length) {
      listInstances(publisher.labels, ['id', 'name'])
    }
  }
}
