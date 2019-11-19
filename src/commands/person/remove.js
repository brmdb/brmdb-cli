module.exports = {
  name: 'remove',
  description: 'Remove the person from the database',
  run: async toolbox => {
    const {
      parameters: { options },
      print: { success, error },
      prompt: { confirm },
      db: { Person }
    } = toolbox

    if (!options.id) {
      error('You need to specify an id with the --id option.')
      return
    }

    const person = await Person.findOne({ where: { id: options.id } })
    if (!person) {
      error(`A person with id ${options.id} does not exists.`)
      return
    }

    if (
      (options.confirm === undefined || options.confirm) &&
      (await confirm('Are you sure?'))
    ) {
      await person.destroy()
      success('Person removed with success.')
    }
  }
}
