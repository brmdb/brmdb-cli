module.exports = {
  name: 'details',
  description: 'Show the details from a person in the database',
  run: async toolbox => {
    const {
      parameters: { options },
      print: { table, error, info },
      db: { ExternalLink, Person }
    } = toolbox

    if (!options.id) {
      error('You need to specify an id with the --id option.')
      return
    }

    const person = await Person.findOne({
      include: [{ model: ExternalLink, as: 'externalLinks' }],
      where: { id: options.id }
    })
    if (!person) {
      error(`A person with id ${options.id} does not exists.`)
      return
    }

    const tableHeader = ['Attribute', 'Value']
    const tableData = Object.entries(person.dataValues).filter(
      ([k, v]) => typeof v !== 'object' && k !== 'bio'
    )
    table([tableHeader].concat(tableData), { format: 'lean' })

    if (person.externalLinks.length === 0) {
      info('The person has no links associated.')
    } else {
      const linksInTableFormat = person.externalLinks.map(p => [
        p.id,
        p.name,
        p.type,
        p.url
      ])
      const tableHeader = ['ID', 'Name', 'Type', 'URL']
      table([tableHeader].concat(linksInTableFormat), { format: 'lean' })
    }
  }
}
