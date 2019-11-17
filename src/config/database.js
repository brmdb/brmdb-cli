const path = require('path')

module.exports = {
  dialect: 'sqlite',
  storage: path.resolve(__dirname, '../../../brmdb-data/database.sqlite'),
  logging: false
}
