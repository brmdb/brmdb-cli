module.exports = async toolbox => {
  const fs = require('fs')
  const path = require('path')
  const config = require('../config/database')
  const { Sequelize } = require('sequelize')

  async function logAction(model, referer, action) {
    const contributor = await toolbox.system.run(
      'git config --global user.name',
      { trim: true }
    )

    toolbox.db.Action.create({ model, referer, action, contributor })
  }

  toolbox.db = {}

  // If a database exists in the current folder, use it instead,
  // It's used for the automated deploy.
  if (toolbox.filesystem.isFile('database.sqlite')) {
    config.storage = path.join(process.cwd(), 'database.sqlite')
  }

  const sequelize = new Sequelize(config)

  fs.readdirSync(path.join(__dirname, '../database/models'))
    .filter(file => {
      return (
        file.indexOf('.') !== 0 &&
        file !== path.basename(__filename) &&
        file.slice(-3) === '.js'
      )
    })
    .forEach(file => {
      const model = sequelize.import(
        path.join(__dirname, '../database/models', file)
      )
      toolbox.db[model.name] = model
    })

  const hooks = [
    { hook: 'afterCreate', type: toolbox.db.Action.types.CREATE },
    { hook: 'afterUpdate', type: toolbox.db.Action.types.UPDATE },
    { hook: 'afterDestroy', type: toolbox.db.Action.types.DELETE }
  ]

  Object.keys(toolbox.db).forEach(modelName => {
    if (modelName !== 'Action') {
      hooks.forEach(h => {
        toolbox.db[modelName][h.hook]((obj, options) => {
          console.log(`logAction(${modelName}, ${obj.id}, ${h.type})`)
          logAction(modelName, obj.id, h.type)
        })
      })
    }

    if (toolbox.db[modelName].associate) {
      toolbox.db[modelName].associate(toolbox.db)
    }
  })

  toolbox.db.sequelize = sequelize
  toolbox.db.Sequelize = Sequelize
}
