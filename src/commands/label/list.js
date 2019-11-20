module.exports = {
  name: 'list',
  description: 'List all labels of a publisher in the database',
  run: async toolbox => {
    const {
      parameters: { options },
      print: { info, error, listInstances },
      db: { Label, Publisher }
    } = toolbox

    let labels = []

    if (!options.publisher) {
      labels = await Label.findAll({
        include: [{ model: Publisher, as: 'publisher' }]
      })
    } else {
      const publisher = await Publisher.findOne({
        where: { id: options.publisher }
      })
      if (!publisher) {
        error(`A publisher with id ${options.publisher} does not exists.`)
        return
      }

      labels = await publisher.getLabels()
    }

    if (labels.length === 0) {
      info('No labels were found in the database.')
      return
    }

    if (options.publisher) {
      listInstances(labels, ['id', 'name'])
    } else {
      listInstances(labels, [
        'id',
        { path: 'publisher.name', head: 'Publisher' },
        'name'
      ])
    }
  }
}
