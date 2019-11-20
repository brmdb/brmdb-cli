module.exports = {
  name: 'details',
  description: 'Show the details from a label in the database',
  run: async toolbox => {
    const {
      parameters,
      print: { tabulateInstance, error },
      db: { Label }
    } = toolbox

    if (!parameters.first) {
      error('You need to specify an id.')
      return
    }

    const label = await Label.findOne({
      where: { id: parameters.first }
    })
    if (!label) {
      error(`A label with id ${parameters.first} does not exists.`)
      return
    }

    tabulateInstance(label, ['description'])
  }
}
