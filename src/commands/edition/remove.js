module.exports = {
  name: 'remove',
  description: 'Remove the edition from the database',
  run: async toolbox => {
    const {
      parameters,
      print: { success, error },
      prompt: { confirm },
      db: { Edition }
    } = toolbox

    if (!parameters.first) {
      error('You need to specify an id.')
      return
    }

    const edition = await Edition.findOne({ where: { id: parameters.first } })
    if (!edition) {
      error(`A edition with id ${parameters.first} does not exists.`)
      return
    }

    if (
      (parameters.options.confirm === undefined ||
        parameters.options.confirm) &&
      (await confirm('Are you sure?'))
    ) {
      await edition.destroy()
      success('Edition removed with success.')
    }
  }
}
