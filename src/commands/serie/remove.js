module.exports = {
  name: 'remove',
  description: 'Remove the serie from the database',
  run: async toolbox => {
    const {
      parameters: { options },
      print: { success, error },
      prompt: { confirm },
      db: { Serie }
    } = toolbox

    if (!options.id) {
      error('You need to specify an id with the --id option.')
      return
    }

    const serie = await Serie.findOne({ where: { id: options.id } })
    if (!serie) {
      error(`A serie with id ${options.id} does not exists.`)
      return
    }

    if (
      (options.confirm === undefined || options.confirm) &&
      (await confirm('Are you sure?'))
    ) {
      await serie.destroy()
      success('Serie removed with success.')
    }
  }
}
