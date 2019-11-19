module.exports = {
  name: 'list',
  description: 'List the series in the database',
  run: async toolbox => {
    const {
      print: { info, table },
      db: { Serie }
    } = toolbox

    const series = await Serie.findAll()

    if (series.length === 0) {
      info('There is no series in the database.')
      return
    }

    const seriesInTableFormat = series.map(s => [
      s.id,
      s.title,
      s.status,
      s.type,
      s.demografy
    ])
    const tableHeader = ['ID', 'Title', 'Status', 'Type', 'Demografy']
    table([tableHeader].concat(seriesInTableFormat), { format: 'lean' })
  }
}
