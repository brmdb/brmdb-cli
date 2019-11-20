module.exports = {
  name: 'remove',
  description: 'Remove the publisher from the database',
  run: async toolbox => {
    const {
      parameters,
      print: { success, error },
      prompt: { confirm },
      db: { Publisher }
    } = toolbox

    if (!parameters.first) {
      error('You need to specify an id')
      return
    }

    const publisher = await Publisher.findOne({
      where: { id: parameters.first }
    })
    if (!publisher) {
      error(`A publisher with id ${parameters.first} does not exists.`)
      return
    }

    if (
      (parameters.options.confirm === undefined ||
        parameters.options.confirm) &&
      (await confirm('Are you sure?'))
    ) {
      await publisher.destroy()
      success('Publisher removed with success.')
    }
  }
}
