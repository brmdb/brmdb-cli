module.exports = {
  name: 'order',
  description: 'Change the order of the items',
  run: async toolbox => {
    const {
      print: { success },
      customAsk,
      db: { Checklist, ChecklistItem, Edition, Serie, Volume },
      customPrompt: { selectChecklistToEdit },
      strings: { startCase, lowerCase }
    } = toolbox

    const checklistId = await selectChecklistToEdit()
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
      where: { id: checklistId }
    })

    function fixType(type) {
      return startCase(lowerCase(type.replace(/_/g, ' ')))
    }

    const volumeChoices = checklist.items.map(ci => ({
      name: ci.id,
      message: `${ci.volume.edition.serie.title} (${fixType(
        ci.volume.edition.serie.type
      )}) - ${ci.volume.edition.name} - #${ci.volume.number}`
    }))

    const { newOrder } = await customAsk([
      {
        type: 'sort',
        name: 'newOrder',
        message: 'Sort the items',
        choices: volumeChoices
      }
    ])

    for (const [i, id] of newOrder.entries()) {
      await ChecklistItem.update({ order: i }, { where: { id } })
    }

    success(`Order changed.`)
  }
}
