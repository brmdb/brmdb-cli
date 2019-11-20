module.exports = {
  name: 'edit',
  description: 'Edit a existing label in the database',
  run: async toolbox => {
    const {
      print: { success },
      customAsk,
      db: { Label },
      customPrompt: { fillPrompt, selectLabelToEdit }
    } = toolbox

    const labelId = await selectLabelToEdit()

    const label = await Label.findOne({ where: { id: labelId } })

    const prompt = require('../../prompts/label')
    const filledPrompt = fillPrompt(prompt, label)

    const result = await customAsk(filledPrompt)
    await label.update(result)

    success(`Label '${label.name}' edited.`)
  }
}
