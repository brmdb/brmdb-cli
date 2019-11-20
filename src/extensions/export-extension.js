module.exports = toolbox => {
  const flatMap = require('lodash.flatmap')
  const sortBy = require('lodash.sortby')
  const Listr = require('listr')

  const { db, filesystem } = toolbox

  function generateIndexPromise(
    folder,
    model,
    plain = false,
    options = {},
    transformData = undefined
  ) {
    return async () => {
      let instances = await model.findAll(options)
      instances = transformData
        ? transformData(instances)
        : instances.map(i => (plain ? i.get({ plain }) : i.dataValues))
      const file = filesystem.path(folder, 'list.json')
      await filesystem.writeAsync(file, instances)
    }
  }

  const indexPublisherPromise = folder => {
    return generateIndexPromise(folder, db.Publisher, false, {
      attributes: ['id', 'name']
    })
  }

  const indexPersonPromise = folder => {
    return generateIndexPromise(folder, db.Person, false, {
      attributes: ['id', 'name']
    })
  }

  const indexSeriePromise = folder => {
    return generateIndexPromise(
      folder,
      db.Serie,
      false,
      { attributes: ['id', 'title', 'alternativeTitles'] },
      series => {
        const withAlternativeTitles = flatMap(series, s =>
          [{ id: s.id, title: s.title }].concat(
            s.synonyms.map(a => ({ id: s.id, title: a }))
          )
        )
        return sortBy(withAlternativeTitles, ['title'])
      }
    )
  }

  function generateFullListPromise(folder, model, transformData, options = {}) {
    return async () => {
      const instances = await model.findAll({
        order: [['createdAt', 'ASC']],
        ...options
      })
      const transformed = transformData(instances)
      const file = filesystem.path(folder, 'all.json')
      await toolbox.filesystem.writeAsync(file, transformed)
    }
  }

  const fullListPublisherPromise = folder => {
    return generateFullListPromise(
      folder,
      db.Publisher,
      ps => ps.map(p => p.get({ plain: true })),
      {
        include: [
          {
            model: db.Label,
            as: 'labels',
            attributes: ['id', 'name', 'logoUrl']
          }
        ]
      }
    )
  }

  const fullListLabelPromise = folder => {
    return generateFullListPromise(
      folder,
      db.Label,
      ls => ls.map(l => l.get({ plain: true })),
      {
        attributes: { exclude: 'publisherId' },
        include: [
          {
            model: db.Publisher,
            as: 'publisher',
            attributes: ['id', 'name', 'logoUrl']
          }
        ]
      }
    )
  }

  const fullListPersonPromise = folder => {
    return generateFullListPromise(folder, db.Person, ps =>
      ps.map(p => p.get({ plain: true }))
    )
  }

  const fullListSeriePromise = folder => {
    return generateFullListPromise(
      folder,
      db.Serie,
      ss =>
        ss.map(s => ({
          ...s.dataValues,
          alternativeTitles: s.get('synonyms'),
          genres: s.get('genresArray')
        })),
      { attributes: { exclude: ['synonyms', 'genresArray'] } }
    )
  }

  const fullListActionPromise = folder => {
    return generateFullListPromise(folder, db.Action, as =>
      as.map(a => a.get({ plain: true }))
    )
  }

  function generateIndividualPromise(
    folder,
    model,
    transformData = i => i,
    options = {}
  ) {
    return async () => {
      const instances = await model.findAll(options)
      for (const instance of instances) {
        const file = filesystem.path(folder, `${instance.id}.json`)
        await filesystem.writeAsync(file, transformData(instance))
      }
    }
  }

  const individualPublisherPromise = folder => {
    return generateIndividualPromise(folder, db.Publisher, i => i, {
      include: [
        {
          model: db.ExternalLink,
          as: 'externalLinks',
          attributes: ['name', 'type', 'url'],
          through: { attributes: [] }
        },
        {
          model: db.Label,
          as: 'labels',
          attributes: ['id', 'name', 'createdAt', 'updatedAt', 'logoUrl']
        }
      ]
    })
  }

  const individualPersonPromise = folder => {
    return generateIndividualPromise(
      folder,
      db.Person,
      i => i.get({ plain: true }),
      {
        include: [
          {
            model: db.ExternalLink,
            as: 'externalLinks',
            attributes: ['name', 'type', 'url'],
            through: { attributes: [] }
          }
        ]
      }
    )
  }

  const individualLabelPromise = folder => {
    return generateIndividualPromise(
      folder,
      db.Label,
      l => l.get({ plain: true }),
      {
        attributes: { exclude: ['publisherId'] },
        order: [
          [{ model: db.Edition, as: 'editionsReleased' }, 'startDate', 'ASC']
        ],
        include: [
          {
            model: db.Publisher,
            as: 'publisher',
            include: [
              {
                model: db.ExternalLink,
                as: 'externalLinks',
                attributes: ['name', 'type', 'url'],
                through: { attributes: [] }
              }
            ]
          },
          {
            model: db.Edition,
            as: 'editionsReleased',
            attributes: [
              'id',
              'name',
              'status',
              'period',
              'startDate',
              'endDate'
            ],
            include: [
              {
                model: db.Serie,
                as: 'serie',
                attributes: ['id', 'title', 'coverUrl', 'posterUrl']
              }
            ]
          }
        ]
      }
    )
  }

  const individualSeriePromise = folder => {
    return generateIndividualPromise(
      folder,
      db.Serie,
      i => ({
        coverUrl: i.get('coverUrl'),
        posterUrl: i.get('posterUrl'),
        ...i.dataValues,
        alternativeTitles: i.get('synonyms'),
        genres: i.get('genresArray')
      }),
      {
        attributes: {
          exclude: ['synonyms', 'genresArray']
        },
        include: [
          {
            model: db.ExternalLink,
            as: 'externalLinks',
            attributes: ['name', 'type', 'url'],
            through: { attributes: [] }
          },
          {
            model: db.SeriePerson,
            as: 'creators',
            attributes: ['role'],
            include: [
              {
                model: db.Person,
                as: 'person',
                attributes: ['id', 'name']
              }
            ]
          },
          {
            model: db.Edition,
            as: 'editions',
            attributes: [
              'id',
              'name',
              'status',
              'period',
              'startDate',
              'endDate'
            ],
            include: [
              {
                model: db.Label,
                as: 'label',
                attributes: ['id', 'name', 'logoUrl'],
                include: [
                  {
                    model: db.Publisher,
                    as: 'publisher',
                    attributes: ['id', 'name', 'logoUrl']
                  }
                ]
              }
            ]
          }
        ]
      }
    )
  }

  const individualEditionPromise = folder => {
    return generateIndividualPromise(
      folder,
      db.Edition,
      i => i.get({ plain: true }),
      {
        attributes: { exclude: ['labelId', 'serieId'] },
        include: [
          {
            model: db.ExternalLink,
            as: 'externalLinks',
            attributes: ['name', 'type', 'url'],
            through: { attributes: [] }
          },
          {
            model: db.Serie,
            as: 'serie',
            attributes: ['id', 'title', 'coverUrl', 'posterUrl']
          },
          {
            model: db.Label,
            as: 'label',
            attributes: ['id', 'name', 'logoUrl'],
            include: [
              {
                model: db.Publisher,
                as: 'publisher',
                attributes: ['id', 'name', 'logoUrl']
              }
            ]
          }
        ]
      }
    )
  }

  function generateFolderMapping(folder) {
    return {
      Publisher: filesystem.path(folder, 'publishers'),
      Label: filesystem.path(folder, 'labels'),
      Serie: filesystem.path(folder, 'series'),
      Person: filesystem.path(folder, 'people'),
      Action: filesystem.path(folder, 'actions'),
      Edition: filesystem.path(folder, 'editions')
    }
  }

  function generateExportTasks(folder) {
    const FOLDERS = generateFolderMapping(folder)

    return {
      Publisher: () =>
        new Listr([
          {
            title: 'Generating index for search',
            task: indexPublisherPromise(FOLDERS.Publisher)
          },
          {
            title: 'Generating the full list',
            task: fullListPublisherPromise(FOLDERS.Publisher)
          },
          {
            title: 'Generating the individual files',
            task: individualPublisherPromise(FOLDERS.Publisher)
          }
        ]),
      Person: () =>
        new Listr([
          {
            title: 'Generating index for search',
            task: indexPersonPromise(FOLDERS.Person)
          },
          {
            title: 'Generating the full list',
            task: fullListPersonPromise(FOLDERS.Person)
          },
          {
            title: 'Generating the individual files',
            task: individualPersonPromise(FOLDERS.Person)
          }
        ]),
      Serie: () =>
        new Listr([
          {
            title: 'Generating index for search',
            task: indexSeriePromise(FOLDERS.Serie)
          },
          {
            title: 'Generating the full list',
            task: fullListSeriePromise(FOLDERS.Serie)
          },
          {
            title: 'Generating the individual files',
            task: individualSeriePromise(FOLDERS.Serie)
          }
        ]),
      Label: () =>
        new Listr([
          {
            title: 'Generating the full list',
            task: fullListLabelPromise(FOLDERS.Label)
          },
          {
            title: 'Generating the individual files',
            task: individualLabelPromise(FOLDERS.Label)
          }
        ]),
      Action: () =>
        new Listr([
          {
            title: 'Generating the full list',
            task: fullListActionPromise(FOLDERS.Action)
          }
        ]),
      Edition: () =>
        new Listr([
          {
            title: 'Generating the individual files',
            task: individualEditionPromise(FOLDERS.Edition)
          }
        ])
    }
  }

  toolbox.exportData = async (folder, models = []) => {
    const EXPORT_TASKS = generateExportTasks(folder)
    const tasks = Object.keys(EXPORT_TASKS)
      .filter(k => models.includes(k))
      .map(k => ({ title: k, task: EXPORT_TASKS[k] }))
    await new Listr(tasks).run()
  }
}
