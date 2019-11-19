module.exports = {
  name: 'list',
  description: 'List the people in the database',
  run: async toolbox => {
    const {
      print: { info, table },
      db: { Person }
    } = toolbox

    const people = await Person.findAll()

    if (people.length === 0) {
      info('There is no people in the database.')
      return
    }

    const peopleInTableFormat = people.map(p => [p.id, p.name])
    const tableHeader = ['ID', 'Name']
    table([tableHeader].concat(peopleInTableFormat), { format: 'lean' })
  }
}
