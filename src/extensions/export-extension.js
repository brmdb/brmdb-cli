module.exports = toolbox => {
  toolbox.exportModels = {}

  toolbox.exportModels.publisher = async folder => {
    // Part 1: generate the search indexing.
    const publishersForSearch = await toolbox.db.Publisher.findAll({
      attributes: ['id', 'name']
    }).map(p => ({ ...p.get({ plain: true }), image: '' }))
    const searchFile = toolbox.filesystem.path(folder, 'list.json')
    await toolbox.filesystem.writeAsync(searchFile, publishersForSearch)

    // Part 2: generate the full list.
    const allPublishers = await toolbox.db.Publisher.findAll().map(p =>
      p.get({ plain: true })
    )
    const completeFile = toolbox.filesystem.path(folder, 'all.json')
    await toolbox.filesystem.writeAsync(completeFile, allPublishers)

    // Part 3: generate individual files.
    for (const publisher of allPublishers) {
      const publisherFile = toolbox.filesystem.path(
        folder,
        `${publisher.id}.json`
      )
      await toolbox.filesystem.writeAsync(publisherFile, publisher)
    }
  }

  toolbox.exportModels.action = async folder => {
    // Part 1: generate the whole actions log.
    const actionsLog = await toolbox.db.Action.findAll().map(p =>
      p.get({ plain: true })
    )
    const logFile = toolbox.filesystem.path(folder, 'all.json')
    await toolbox.filesystem.writeAsync(logFile, actionsLog)

    // Part 2: generate the last 20 actions list.
    const lastActions = await toolbox.db.Action.findAll({
      limit: 20,
      order: [['createdAt', 'DESC']]
    }).map(p => p.get({ plain: true }))
    const recentLogFile = toolbox.filesystem.path(folder, 'latest.json')
    await toolbox.filesystem.writeAsync(recentLogFile, lastActions)
  }
}
