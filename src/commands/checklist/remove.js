module.exports = {
  name: 'remove',
  description: 'Remove the checklist from the database',
  run: async toolbox => {
    const {
      parameters,
      print: { success, error },
      prompt: { confirm },
      db: { Checklist }
    } = toolbox

    if (!parameters.first) {
      error('You need to specify an id.')
      return
    }

    const checklist = await Checklist.findOne({
      where: { id: parameters.first }
    })
    if (!checklist) {
      error(`A checklist with id ${parameters.first} does not exists.`)
      return
    }

    if (
      (parameters.options.confirm === undefined ||
        parameters.options.confirm) &&
      (await confirm('Are you sure?'))
    ) {
      await checklist.destroy()
      success('Checklist removed with success.')
    }
  }
}
