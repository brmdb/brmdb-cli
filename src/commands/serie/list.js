module.exports = {
  name: 'list',
  description: 'List the series in the database',
  run: async toolbox => {
    const {
      print: { info, listInstances },
      db: { Serie }
    } = toolbox

    const series = await Serie.findAll()

    if (series.length === 0) {
      info('There is no series in the database.')
      return
    }

    listInstances(series, ['id', 'title', 'status', 'type', 'demografy'])
  }
}
