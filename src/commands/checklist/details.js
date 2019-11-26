module.exports = {
  name: 'details',
  description: 'Show the details from a checklist in the database',
  run: async toolbox => {
    const {
      parameters,
      print: { tabulateInstance, listInstances, error },
      db: { Checklist, ChecklistItem, Edition, Serie, Volume }
    } = toolbox

    if (!parameters.first) {
      error('You need to specify an id.')
      return
    }

    const checklist = await Checklist.findOne({
      include: [
        {
          model: ChecklistItem,
          as: 'items',
          include: [
            {
              model: Volume,
              as: 'volume',
              include: [
                {
                  model: Edition,
                  as: 'edition',
                  include: [{ model: Serie, as: 'serie' }]
                }
              ]
            }
          ]
        }
      ],
      order: [[{ model: ChecklistItem, as: 'items' }, 'order', 'ASC']],
      where: { id: parameters.first }
    })
    if (!checklist) {
      error(`A checklist with id ${parameters.first} does not exists.`)
      return
    }

    tabulateInstance(checklist, ['observation'])

    if (checklist.items.length) {
      listInstances(checklist.items, [
        'id',
        'order',
        { head: 'Serie', path: 'volume.edition.serie.title' },
        { head: 'Edition', path: 'volume.edition.name' },
        { head: 'Number', path: 'volume.number' },
        { head: 'Price', path: 'volume.price' }
      ])
    }
  }
}
