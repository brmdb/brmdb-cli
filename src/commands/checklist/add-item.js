module.exports = {
  name: 'add-item',
  description: 'Add a new item in an existing checklist',
  run: async toolbox => {
    const {
      print: { success },
      db: { ChecklistItem },
      customPrompt: {
        selectChecklistToEdit,
        selectEditionToEdit,
        selectVolumeToEdit
      }
    } = toolbox

    const checklistId = await selectChecklistToEdit()

    const editionId = await selectEditionToEdit()
    const volumeId = await selectVolumeToEdit(editionId)

    const lastItem = await ChecklistItem.findOne({
      order: [['order', 'DESC']],
      where: { checklistId }
    })
    const order = lastItem ? lastItem.order + 1 : 0

    await ChecklistItem.create({ checklistId, volumeId, order })

    success(`Volume inserted at the end.`)
  }
}
