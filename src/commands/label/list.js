module.exports = {
  name: 'list',
  description: 'List all labels of a publisher in the database',
  run: async toolbox => {
    const {
      parameters: { options },
      print: { info, error, table },
      db: { Publisher }
    } = toolbox

    if (!options.publisher) {
      error('You need to specify a publisher with the --publisher option.')
      return
    }

    const publisher = await Publisher.findOne({
      where: { id: options.publisher }
    })
    if (!publisher) {
      error(`A publisher with id ${options.publisher} does not exists.`)
      return
    }

    const labels = await publisher.getLabels()

    if (labels.length === 0) {
      info('The publisher specified has no labels in the database.')
      return
    }

    const labelsInTableFormat = labels.map(p => [p.id, p.name])
    const labelsTableHeader = ['ID', 'Name']
    const tableData = [labelsTableHeader].concat(labelsInTableFormat)
    table(tableData, { format: 'lean' })
  }
}
