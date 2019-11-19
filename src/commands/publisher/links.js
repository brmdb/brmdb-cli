module.exports = {
  name: 'links',
  description: 'List the links from a publisher in the database',
  run: async toolbox => {
    const {
      parameters: { options },
      print: { table, error },
      db: { ExternalLink, Publisher }
    } = toolbox

    if (!options.id) {
      error('You need to specify an id with the --id option.')
      return
    }

    const publisher = await Publisher.findOne({
      include: [{ model: ExternalLink, as: 'externalLinks' }],
      where: { id: options.id }
    })
    if (!publisher) {
      error(`A publisher with id ${options.id} does not exists.`)
      return
    }

    if (publisher.externalLinks.length === 0) {
      error('The publisher has no links associated.')
      return
    }

    const linksInTableFormat = publisher.externalLinks.map(p => [
      p.id,
      p.name,
      p.type,
      p.url
    ])
    const tableHeader = ['ID', 'Name', 'Type', 'URL']
    table([tableHeader].concat(linksInTableFormat), { format: 'lean' })
  }
}
