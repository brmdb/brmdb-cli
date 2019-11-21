module.exports = {
  name: 'remove',
  description: 'Remove the volume from the database',
  run: async toolbox => {
    const {
      parameters,
      print: { success, error },
      prompt: { confirm },
      db: { Volume }
    } = toolbox

    if (!parameters.first) {
      error('You need to specify an id.')
      return
    }

    const volume = await Volume.findByPk(parameters.first)
    if (!volume) {
      error(`A volume with id ${parameters.first} does not exists.`)
      return
    }

    if (
      (parameters.options.confirm === undefined ||
        parameters.options.confirm) &&
      (await confirm('Are you sure?'))
    ) {
      await volume.destroy()
      success('Volume removed with success.')
    }
  }
}
