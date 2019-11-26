module.exports = {
  name: 'remove-item',
  description: 'Remove an item from a checklist',
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

    const { idsToRemove } = await customAsk([
      {
        type: 'multiselect',
        name: 'idsToRemove',
        message: 'Select the items to remove',
        choices: volumeChoices
      }
    ])

    for (const id of idsToRemove) {
      await ChecklistItem.destroy({ where: { id } })
    }

    // Reorder the volumes.
    const items = await ChecklistItem.findAll({
      order: [['order', 'ASC']],
      where: { checklistId }
    })

    for (const [i, item] of items.entries()) {
      await ChecklistItem.update({ order: i }, { where: { id: item.id } })
    }

    success(`Items removed and order recreated.`)
  }
}
