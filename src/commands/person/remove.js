module.exports = {
  name: 'remove',
  description: 'Remove the person from the database',
  run: async toolbox => {
    const {
      parameters,
      print: { success, error },
      prompt: { confirm },
      db: { Person }
    } = toolbox

    if (!parameters.first) {
      error('You need to specify an id')
      return
    }

    const person = await Person.findOne({ where: { id: parameters.first } })
    if (!person) {
      error(`A person with id ${parameters.first} does not exists.`)
      return
    }

    if (
      (parameters.options.confirm === undefined ||
        parameters.options.confirm) &&
      (await confirm('Are you sure?'))
    ) {
      await person.destroy()
      success('Person removed with success.')
    }
  }
}
