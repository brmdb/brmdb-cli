module.exports = {
  name: 'details',
  description: 'Show the details from a publisher in the database',
  run: async toolbox => {
    const {
      parameters: { options },
      print: { table, error, info },
      db: { ExternalLink, Publisher, Label }
    } = toolbox

    if (!options.id) {
      error('You need to specify an id with the --id option.')
      return
    }

    const publisher = await Publisher.findOne({
      include: [
        { model: ExternalLink, as: 'externalLinks' },
        { model: Label, as: 'labels' }
      ],
      where: { id: options.id }
    })
    if (!publisher) {
      error(`A publisher with id ${options.id} does not exists.`)
      return
    }

    const tableHeader = ['Attribute', 'Value']
    const tableData = Object.entries(publisher.dataValues).filter(
      ([k, v]) => typeof v !== 'object' && k !== 'bio'
    )
    table([tableHeader].concat(tableData), { format: 'lean' })

    if (publisher.externalLinks.length === 0) {
      info('The publisher has no links associated.')
    } else {
      const linksInTableFormat = publisher.externalLinks.map(p => [
        p.id,
        p.name,
        p.type,
        p.url
      ])
      const tableHeader = ['ID', 'Name', 'Type', 'URL']
      table([tableHeader].concat(linksInTableFormat), { format: 'lean' })
    }

    if (publisher.labels.length === 0) {
      info('The publisher has no labels.')
    } else {
      const labelsInTableFormat = publisher.labels.map(l => [l.id, l.name])
      const tableHeader = ['ID', 'Name']
      table([tableHeader].concat(labelsInTableFormat), { format: 'lean' })
    }
  }
}
