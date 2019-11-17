module.exports = {
  name: 'publisher:list',
  description: 'List all publishers in the database',
  run: async toolbox => {
    const {
      print: { info, table },
      db: { Publisher }
    } = toolbox

    const publishers = await Publisher.findAll()

    if (publishers.length === 0) {
      info('There is no publishers in the database.')
      return
    }

    const publishersInTableFormat = publishers.map(p => [p.id, p.name, p.site])
    const tableData = [['ID', 'Name', 'Site']].concat(publishersInTableFormat)
    table(tableData, { format: 'lean' })
  }
}
