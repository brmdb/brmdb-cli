module.exports = {
  name: 'details',
  description: 'Show the details from a volume in the database',
  run: async toolbox => {
    const {
      parameters,
      print: { tabulateInstance, listInstances, error },
      db: { Person, Volume, VolumePerson }
    } = toolbox

    if (!parameters.first) {
      error('You need to specify an id.')
      return
    }

    const volume = await Volume.findOne({
      include: [
        {
          model: VolumePerson,
          as: 'involvedPeople',
          include: [{ model: Person, as: 'person' }]
        }
      ],
      where: { id: parameters.first }
    })
    if (!volume) {
      error(`A volume with id ${parameters.first} does not exists.`)
      return
    }

    tabulateInstance(volume, ['synopsis'])

    if (volume.involvedPeople.length) {
      listInstances(volume.involvedPeople, ['id', 'person.name', 'role'])
    }
  }
}
