module.exports = {
  name: 'details',
  description: 'Show the details from a serie in the database',
  run: async toolbox => {
    const {
      parameters,
      print: { tabulateInstance, listInstances, error },
      db: {
        Edition,
        ExternalLink,
        Label,
        Serie,
        SeriePerson,
        Person,
        Publisher
      }
    } = toolbox

    if (!parameters.first) {
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
        },
        {
          model: Edition,
          as: 'editions',
          include: [
            {
              model: Label,
              as: 'label',
              include: [{ model: Publisher, as: 'publisher' }]
            }
          ]
        }
      ],
      where: { id: parameters.first }
    })
    if (!serie) {
      error(`A serie with id ${parameters.first} does not exists.`)
      return
    }

    tabulateInstance(serie, ['synopsis'])

    if (serie.externalLinks.length) {
      listInstances(
        serie.externalLinks,
        ['id', 'name', 'type', 'url'],
        [38, 22, 14, 30]
      )
    }

    if (serie.creators.length) {
      listInstances(serie.creators, ['id', 'person.name', 'role'])
    }

    if (serie.editions.length) {
      listInstances(serie.editions, [
        'id',
        { path: 'label.publisher.name', head: 'Publisher' },
        { path: 'label.name', head: 'Label' },
        'name',
        'type',
        'status',
        'period'
      ])
    }
  }
}
