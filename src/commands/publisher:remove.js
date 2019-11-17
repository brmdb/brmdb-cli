module.exports = {
  name: 'publisher:remove',
  description: 'Remove the publisher from the database',
  run: async toolbox => {
    const {
      parameters: { options },
      print: { success, error },
      prompt: { confirm },
      db: { Publisher }
    } = toolbox

    if (!options.id) {
      error('You need to specify an id with the --id option.')
      return
    }

    if (isNaN(parseInt(options.id, 10))) {
      error('The id provided is not valid.')
      return
    }

    const publisher = await Publisher.findOne({ where: { id: options.id } })
    if (!publisher) {
      error(`A publisher with id ${options.id} does not exists.`)
      return
    }

    if (
      (options.confirm === undefined || options.confirm) &&
      (await confirm('Are you sure?'))
    ) {
      await Publisher.destroy({ where: { id: options.id } })
      success('Publisher removed with success.')
    }
  }
}
