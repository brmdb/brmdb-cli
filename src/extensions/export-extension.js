module.exports = toolbox => {
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
      await filesystem.writeAsync(file, instances, { jsonIndent: 0 })
    }
  }

  const indexPublisherPromise = folder => {
    return generateIndexPromise(folder, db.Publisher, true, {
      attributes: ['id', 'name', 'slug', 'logoUrl', 'bannerUrl']
    })
  }

  const indexPersonPromise = folder => {
    return generateIndexPromise(folder, db.Person, true, {
      attributes: ['id', 'name', 'slug']
    })
  }

  const indexSeriePromise = folder => {
    return generateIndexPromise(
      folder,
      db.Serie,
      false,
      {
        attributes: [
          'id',
          'title',
          'alternativeTitles',
          'type',
          'slug',
          'posterUrl'
        ]
      },
      series => {
        return series.map(s => ({
          ...s.dataValues,
          alternativeTitles: s.get('synonyms')
        }))
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
      await toolbox.filesystem.writeAsync(file, transformed, { jsonIndent: 0 })
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
            attributes: ['id', 'name', 'logoUrl', 'bannerUrl', 'slug']
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
          slug: s.get('slug'),
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
    options = {},
    fileName = 'id'
  ) {
    return async () => {
      const instances = await model.findAll(options)
      for (const instance of instances) {
        const file = filesystem.path(folder, `${instance[fileName]}.json`)
        await filesystem.writeAsync(file, transformData(instance), {
          jsonIndent: 0
        })
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
                attributes: [
                  'id',
                  'title',
                  'type',
                  'bannerUrl',
                  'posterUrl',
                  'slug'
                ]
              }
            ]
          }
        ]
      }
    )
  }

  const individualSeriePromise = (folder, mode) => {
    return generateIndividualPromise(
      folder,
      db.Serie,
      i => ({
        slug: i.get('slug'),
        ...i.dataValues,
        alternativeTitles: i.get('synonyms'),
        genres: i.get('genresArray')
      }),
      {
        order: [
          [{ model: db.Edition, as: 'editions' }, 'startDate', 'DESC'],
          [db.sequelize.literal('`editions.volumes.number` * 1')],
          [db.sequelize.col('`editions.volumes.number`')]
        ],
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
                attributes: ['id', 'name', 'slug']
              }
            ]
          },
          {
            model: db.Edition,
            as: 'editions',
            attributes: { exclude: ['labelId', 'serieId'] },
            include: [
              {
                model: db.ExternalLink,
                as: 'externalLinks',
                attributes: ['name', 'type', 'url'],
                through: { attributes: [] }
              },
              {
                model: db.Label,
                as: 'label',
                attributes: ['id', 'name', 'logoUrl'],
                include: [
                  {
                    model: db.Publisher,
                    as: 'publisher',
                    attributes: ['id', 'name', 'logoUrl', 'bannerUrl', 'slug']
                  }
                ]
              },
              {
                model: db.Volume,
                as: 'volumes',
                include: [
                  {
                    model: db.VolumePerson,
                    as: 'involvedPeople',
                    attributes: ['role'],
                    include: [
                      {
                        model: db.Person,
                        as: 'person',
                        attributes: ['id', 'name', 'slug', 'imageUrl']
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      },
      mode
    )
  }

  const individualEditionPromise = folder => {
    return generateIndividualPromise(
      folder,
      db.Edition,
      i => i.get({ plain: true }),
      {
        attributes: { exclude: ['labelId', 'serieId'] },
        order: [
          [db.sequelize.literal('volumes.number *1 ')],
          [db.sequelize.col('volumes.number')]
        ],
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
            attributes: [
              'id',
              'title',
              'type',
              'bannerUrl',
              'posterUrl',
              'slug'
            ]
          },
          {
            model: db.Label,
            as: 'label',
            attributes: ['id', 'name', 'logoUrl'],
            include: [
              {
                model: db.Publisher,
                as: 'publisher',
                attributes: ['id', 'name', 'logoUrl', 'slug']
              }
            ]
          },
          {
            model: db.Volume,
            as: 'volumes',
            attributes: [
              'id',
              'number',
              'name',
              'isbn',
              'issn',
              'releaseDate',
              'coverUrl'
            ]
          }
        ]
      }
    )
  }

  const individualVolumePromise = (folder, mode) => {
    return generateIndividualPromise(
      folder,
      db.Volume,
      i => ({
        ...i.get({ plain: true }),
        extrasArray: undefined,
        extras: i.extrasArray
      }),
      {
        where: {
          [mode]: {
            [db.Sequelize.Op.ne]: null
          }
        },
        order: [
          [{ model: db.VolumePerson, as: 'involvedPeople' }, 'role'],
          [
            {
              model: db.VolumePerson,
              as: 'involvedPeople'
            },
            { model: db.Person, as: 'person' },
            'name'
          ]
        ],
        include: [
          {
            model: db.Edition,
            as: 'edition',
            attributes: [
              'id',
              'name',
              'status',
              'startDate',
              'endDate',
              'period'
            ],
            include: [
              {
                model: db.Serie,
                as: 'serie',
                attributes: [
                  'id',
                  'title',
                  'type',
                  'bannerUrl',
                  'posterUrl',
                  'slug'
                ]
              }
            ]
          },
          {
            model: db.VolumePerson,
            as: 'involvedPeople',
            attributes: ['id', 'role'],
            include: [
              {
                model: db.Person,
                as: 'person',
                attributes: ['id', 'name', 'slug']
              }
            ]
          }
        ]
      },
      mode
    )
  }

  const generateRecentPromise = (folder, model, options = {}) => {
    return async () => {
      const instances = await model.findAll({
        ...options,
        order: [['createdAt', 'DESC']],
        limit: 10
      })
      await filesystem.writeAsync(
        filesystem.path(folder, 'recent.json'),
        instances,
        { jsonIndent: 0 }
      )
    }
  }

  const recentSeriePromise = folder => {
    return generateRecentPromise(folder, db.Serie, {
      attributes: ['id', 'title', 'posterUrl', 'bannerUrl']
    })
  }

  function generateFolderMapping(folder) {
    return {
      Publisher: filesystem.path(folder, 'publishers'),
      Label: filesystem.path(folder, 'labels'),
      Serie: filesystem.path(folder, 'series'),
      Person: filesystem.path(folder, 'people'),
      Action: filesystem.path(folder, 'actions'),
      Edition: filesystem.path(folder, 'editions'),
      Volume: filesystem.path(folder, 'volumes')
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
            task: individualSeriePromise(FOLDERS.Serie, 'id')
          },
          {
            title: 'Generating the individual files by slug',
            task: individualSeriePromise(
              filesystem.path(FOLDERS.Serie, 'slug'),
              'slug'
            )
          },
          {
            title: 'Generating the recent list',
            task: recentSeriePromise(FOLDERS.Serie)
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
        ]),
      Volume: () =>
        new Listr([
          {
            title: 'Generating the individual files by id',
            task: individualVolumePromise(FOLDERS.Volume, 'id')
          },
          {
            title: 'Generating the individual files by isbn',
            task: individualVolumePromise(
              filesystem.path(FOLDERS.Volume, 'isbn'),
              'isbn'
            )
          },
          {
            title: 'Generating the individual files by issn',
            task: individualVolumePromise(
              filesystem.path(FOLDERS.Volume, 'issn'),
              'issn'
            )
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
