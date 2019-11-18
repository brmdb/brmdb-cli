module.exports = {
  name: 'remove',
  description: 'Remove the label from the database',
  run: async toolbox => {
    const {
      parameters: { options },
      print: { success, error },
      prompt: { confirm },
      db: { Label, Action, logAction }
    } = toolbox

    if (!options.id) {
      error('You need to specify an id with the --id option.')
      return
    }

    if (isNaN(parseInt(options.id, 10))) {
      error('The id provided is not valid.')
      return
    }

    const label = await Label.findOne({ where: { id: options.id } })
    if (!label) {
      error(`A label with id ${options.id} does not exists.`)
      return
    }

    if (
      (options.confirm === undefined || options.confirm) &&
      (await confirm('Are you sure?'))
    ) {
      await Label.destroy({ where: { id: options.id } })
      logAction('Label', options.id, Action.types.DELETE)
      success('Label removed with success.')
    }
  }
}
