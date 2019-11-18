module.exports = toolbox => {
  toolbox.exportModels = {}

  toolbox.exportModels.publisher = async folder => {
    // Part 1: generate the search indexing.
    const publishersForSearch = await toolbox.db.Publisher.findAll({
      attributes: ['id', 'name']
    }).map(p => ({ ...p.dataValues, image: '' }))
    const searchFile = toolbox.filesystem.path(folder, 'list.json')
    await toolbox.filesystem.writeAsync(searchFile, publishersForSearch)

    // Part 2: generate the full list.
    const allPublishers = await toolbox.db.Publisher.findAll({
      include: [
        {
          model: toolbox.db.Label,
          as: 'labels',
          attributes: ['id', 'name', 'createdAt', 'updatedAt']
        }
      ]
    })
    const allPublishersPlain = allPublishers.map(p => ({
      ...p.dataValues,
      labels: p.dataValues.labels.map(l => l.id)
    }))
    const completeFile = toolbox.filesystem.path(folder, 'all.json')
    await toolbox.filesystem.writeAsync(completeFile, allPublishersPlain)

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

  toolbox.exportModels.label = async folder => {
    // Part 1: generate the full list.
    const allLabels = await toolbox.db.Label.findAll().map(l => l.dataValues)
    const completeFile = toolbox.filesystem.path(folder, 'all.json')
    await toolbox.filesystem.writeAsync(completeFile, allLabels)

    // Part 2: generate individual files.
    const individualLabels = await toolbox.db.Label.findAll({
      attributes: ['id', 'name', 'description', 'createdAt', 'updatedAt'],
      include: [{ model: toolbox.db.Publisher, as: 'publisher' }]
    }).map(l => l.dataValues)
    for (const label of individualLabels) {
      const labelFile = toolbox.filesystem.path(folder, `${label.id}.json`)
      await toolbox.filesystem.writeAsync(labelFile, label)
    }
  }
}
