module.exports = {
  name: 'edit',
  description: 'Edit a existing checklist in the database',
  run: async toolbox => {
    const {
      print: { success },
      customAsk,
      db: { Checklist, Label, Publisher },
      customPrompt: { fillPrompt, selectChecklistToEdit }
    } = toolbox

    const checklistId = await selectChecklistToEdit()

    const checklist = await Checklist.findOne({ where: { id: checklistId } })
    const labels = await Label.findAll({
      include: [{ model: Publisher, as: 'publisher' }],
      order: [['name', 'ASC']]
    })

    const checklistPrompt = require('../../prompts/checklist')(labels)
    const filledPrompt = fillPrompt(checklistPrompt, {
      ...checklist.dataValues,
      month: checklist.month.toString()
    })

    const checklistResult = await customAsk(filledPrompt)
    await checklist.update(checklistResult)

    success(`Checklist edited.`)
  }
}
