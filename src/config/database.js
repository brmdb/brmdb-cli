const path = require('path')

module.exports = {
  dialect: 'sqlite',
  storage: path.resolve(__dirname, '../../../data/database.sqlite'),
  logging: false
}
