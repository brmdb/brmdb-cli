module.exports = {
  name: 'actions',
  description: 'List all actions performed in the database',
  run: async toolbox => {
    const {
      parameters: { options },
      print: { info, table },
      strings: { upperCase },
      db: { Action }
    } = toolbox

    const itemsToShow = options.show || 10

    const lastActions = await Action.findAll({
      limit: itemsToShow,
      order: [['createdAt', 'DESC']]
    })

    if (lastActions.length === 0) {
      info('There is no actions in the database.')
      return
    }

    const actionsInTableFormat = lastActions.map(p => [
      p.createdAt.toLocaleDateString('en', {
        dateStyle: 'short',
        timeStyle: 'medium',
        hour12: false
      }),
      p.model,
      p.referer,
      upperCase(p.action),
      p.contributor
    ])
    const actionsTableHeader = [
      'Timestamp',
      'Model',
      'Referer',
      'Action',
      'Contributor'
    ]
    const tableData = [actionsTableHeader].concat(actionsInTableFormat)
    table(tableData, { format: 'lean' })
  }
}
