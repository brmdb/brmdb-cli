module.exports = toolbox => {
  const flatMap = require('lodash.flatmap')
  const sortBy = require('lodash.sortby')

  toolbox.exportModels = {}

  toolbox.exportModels.publisher = async folder => {
    // Part 1: generate the search indexing.
    const publishersForSearch = await toolbox.db.Publisher.findAll({
      attributes: ['id', 'name']
    }).map(p => p.dataValues)
    const searchFile = toolbox.filesystem.path(folder, 'list.json')
    await toolbox.filesystem.writeAsync(searchFile, publishersForSearch)

    // Part 2: generate the full list.
    const allPublishers = await toolbox.db.Publisher.findAll({
      include: [
        {
          model: toolbox.db.Label,
          as: 'labels',
          attributes: ['id', 'name', 'createdAt', 'updatedAt', 'logoUrl']
        }
      ]
    })
    const allPublishersPlain = allPublishers.map(p => ({
      ...p.get({ plain: true }),
      labels: p.dataValues.labels.map(l => l.id)
    }))
    const completeFile = toolbox.filesystem.path(folder, 'all.json')
    await toolbox.filesystem.writeAsync(completeFile, allPublishersPlain)

    // Part 3: generate individual files.
    const individualPublishers = await toolbox.db.Publisher.findAll({
      include: [
        {
          model: toolbox.db.ExternalLink,
          as: 'externalLinks',
          attributes: ['name', 'type', 'url'],
          through: { attributes: [] }
        },
        {
          model: toolbox.db.Label,
          as: 'labels',
          attributes: ['id', 'name', 'createdAt', 'updatedAt', 'logoUrl']
        }
      ]
    })
    for (const publisher of individualPublishers) {
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
    const allLabels = await toolbox.db.Label.findAll().map(l =>
      l.get({ plain: true })
    )
    const completeFile = toolbox.filesystem.path(folder, 'all.json')
    await toolbox.filesystem.writeAsync(completeFile, allLabels)

    // Part 2: generate individual files.
    const individualLabels = await toolbox.db.Label.findAll({
      attributes: [
        'id',
        'name',
        'description',
        'createdAt',
        'updatedAt',
        'logoUrl'
      ],
      include: [
        {
          model: toolbox.db.Publisher,
          as: 'publisher',
          include: [
            {
              model: toolbox.db.ExternalLink,
              as: 'externalLinks',
              attributes: ['name', 'type', 'url'],
              through: { attributes: [] }
            }
          ]
        }
      ]
    }).map(l => l.get({ plain: true }))
    for (const label of individualLabels) {
      const labelFile = toolbox.filesystem.path(folder, `${label.id}.json`)
      await toolbox.filesystem.writeAsync(labelFile, label)
    }
  }

  toolbox.exportModels.person = async folder => {
    // Part 1: generate the full list.
    const allPeople = await toolbox.db.Person.findAll().map(l =>
      l.get({ plain: true })
    )
    const completeFile = toolbox.filesystem.path(folder, 'all.json')
    await toolbox.filesystem.writeAsync(completeFile, allPeople)

    // Part 2: generate individual files.
    const individualPerson = await toolbox.db.Person.findAll({
      include: [
        {
          model: toolbox.db.ExternalLink,
          as: 'externalLinks',
          attributes: ['name', 'type', 'url'],
          through: { attributes: [] }
        }
      ]
    }).map(l => l.get({ plain: true }))
    for (const person of individualPerson) {
      const personFile = toolbox.filesystem.path(folder, `${person.id}.json`)
      await toolbox.filesystem.writeAsync(personFile, person)
    }
  }

  toolbox.exportModels.serie = async folder => {
    // Part 1: generate the search indexing.
    let seriesForSearch = await toolbox.db.Serie.findAll({
      attributes: ['id', 'title', 'alternativeTitles']
    })
    seriesForSearch = flatMap(seriesForSearch, p =>
      [{ id: p.id, title: p.title }].concat(
        p.synonyms.map(s => ({ id: p.id, title: s }))
      )
    )
    seriesForSearch = sortBy(seriesForSearch, ['title'])
    const searchFile = toolbox.filesystem.path(folder, 'list.json')
    await toolbox.filesystem.writeAsync(searchFile, seriesForSearch)

    // Part 2: generate the full list.
    const allSeries = await toolbox.db.Serie.findAll({
      attributes: { exclude: ['synonyms', 'genresArray'] }
    }).map(l => ({
      ...l.dataValues,
      alternativeTitles: l.get('synonyms'),
      genres: l.get('genresArray')
    }))
    const completeFile = toolbox.filesystem.path(folder, 'all.json')
    await toolbox.filesystem.writeAsync(completeFile, allSeries)

    // Part 3: generate individual files.
    const individualSeries = await toolbox.db.Serie.findAll({
      attributes: { exclude: ['synonyms', 'genresArray'] },
      include: [
        {
          model: toolbox.db.ExternalLink,
          as: 'externalLinks',
          attributes: ['name', 'type', 'url'],
          through: { attributes: [] }
        },
        {
          model: toolbox.db.SeriePerson,
          as: 'creators',
          attributes: ['role'],
          include: [
            {
              model: toolbox.db.Person,
              as: 'person',
              attributes: ['id', 'name']
            }
          ]
        }
      ]
    }).map(l => ({
      ...l.dataValues,
      alternativeTitles: l.get('synonyms'),
      genres: l.get('genresArray')
    }))
    for (const serie of individualSeries) {
      const serieFile = toolbox.filesystem.path(folder, `${serie.id}.json`)
      await toolbox.filesystem.writeAsync(serieFile, serie)
    }
  }
}
