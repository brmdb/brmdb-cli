module.exports = {
  name: 'remove',
  description: 'Remove the serie from the database',
  run: async toolbox => {
    const {
      parameters,
      print: { success, error },
      prompt: { confirm },
      db: { Serie }
    } = toolbox

    if (!parameters.first) {
      error('You need to specify an id')
      return
    }

    const serie = await Serie.findOne({ where: { id: parameters.first } })
    if (!serie) {
      error(`A serie with id ${parameters.first} does not exists.`)
      return
    }

    if (
      (parameters.options.confirm === undefined ||
        parameters.options.confirm) &&
      (await confirm('Are you sure?'))
    ) {
      await serie.destroy()
      success('Serie removed with success.')
    }
  }
}
