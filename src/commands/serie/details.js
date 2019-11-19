module.exports = {
  name: 'details',
  description: 'Show the details from a serie in the database',
  run: async toolbox => {
    const {
      parameters: { options },
      print: { table, error, info },
      db: { ExternalLink, Serie, SeriePerson, Person }
    } = toolbox

    if (!options.id) {
      error('You need to specify an id with the --id option.')
      return
    }

    const serie = await Serie.findOne({
      include: [
        { model: ExternalLink, as: 'externalLinks' },
        {
          model: SeriePerson,
          as: 'creators',
          include: [{ model: Person, as: 'person' }]
        }
      ],
      where: { id: options.id }
    })
    if (!serie) {
      error(`A serie with id ${options.id} does not exists.`)
      return
    }

    const tableHeader = ['Attribute', 'Value']
    const tableData = Object.entries(serie.dataValues).filter(
      ([k, v]) => typeof v !== 'object' && k !== 'synopsis'
    )
    table([tableHeader].concat(tableData), { format: 'lean' })

    if (serie.externalLinks.length === 0) {
      info('The serie has no links associated.')
    } else {
      const linksInTableFormat = serie.externalLinks.map(p => [
        p.id,
        p.name,
        p.type,
        p.url
      ])
      const tableHeader = ['ID', 'Name', 'Type', 'URL']
      table([tableHeader].concat(linksInTableFormat), { format: 'lean' })
    }

    if (serie.creators.length === 0) {
      info('The serie has no creators associated.')
    } else {
      const creatorsInTableFormat = serie.creators.map(c => [
        c.id,
        c.person.name,
        c.role
      ])
      const tableHeader = ['ID', 'Person', 'Role']
      table([tableHeader].concat(creatorsInTableFormat), { format: 'lean' })
    }
  }
}
