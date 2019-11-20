module.exports = {
  name: 'list',
  description: 'List all publishers in the database',
  run: async toolbox => {
    const {
      print: { info, listInstances },
      db: { Publisher }
    } = toolbox

    const publishers = await Publisher.findAll()

    if (publishers.length === 0) {
      info('There is no publishers in the database.')
      return
    }

    listInstances(publishers, ['id', 'name', 'site'])
  }
}
