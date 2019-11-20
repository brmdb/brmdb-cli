module.exports = {
  name: 'list',
  description: 'List the people in the database',
  run: async toolbox => {
    const {
      print: { info, listInstances },
      db: { Person }
    } = toolbox

    const people = await Person.findAll()

    if (people.length === 0) {
      info('There is no people in the database.')
      return
    }

    listInstances(people, ['id', 'name'])
  }
}
