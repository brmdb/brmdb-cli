module.exports = {
  name: 'remove',
  description: 'Remove the label from the database',
  run: async toolbox => {
    const {
      parameters,
      print: { success, error },
      prompt: { confirm },
      db: { Label }
    } = toolbox

    if (!parameters.first) {
      error('You need to specify an id')
      return
    }

    const label = await Label.findOne({ where: { id: parameters.first } })
    if (!label) {
      error(`A label with id ${parameters.first} does not exists.`)
      return
    }

    if (
      (parameters.options.confirm === undefined ||
        parameters.options.confirm) &&
      (await confirm('Are you sure?'))
    ) {
      await label.destroy()
      success('Label removed with success.')
    }
  }
}
