module.exports = {
  name: 'details',
  description: 'Show the details from a person in the database',
  run: async toolbox => {
    const {
      parameters,
      print: { tabulateInstance, listInstances, error },
      db: { ExternalLink, Person }
    } = toolbox

    if (!parameters.first) {
      error('You need to specify an id.')
      return
    }

    const person = await Person.findOne({
      include: [{ model: ExternalLink, as: 'externalLinks' }],
      where: { id: parameters.first }
    })
    if (!person) {
      error(`A person with id ${parameters.first} does not exists.`)
      return
    }

    tabulateInstance(person, ['bio'])

    if (person.externalLinks.length) {
      listInstances(
        person.externalLinks,
        ['id', 'name', 'type', 'url'],
        [38, 22, 14, 30]
      )
    }
  }
}
