module.exports = {
  name: 'edit',
  description: 'Edit a existing label in the database',
  run: async toolbox => {
    const {
      print: { success },
      customAsk,
      fillPrompt,
      db: { Publisher, Label }
    } = toolbox

    const publishers = await Publisher.findAll({ order: [['name', 'ASC']] })
    const publisherChoices = publishers.map(p => ({
      name: p.id.toString(),
      message: p.name,
      value: p.id.toString()
    }))

    const { publisherId } = await customAsk([
      {
        type: 'autocomplete',
        name: 'publisherId',
        message: 'What publisher does the label to edit belongs to?',
        choices: publisherChoices
      }
    ])

    const publisher = await Publisher.findOne({ where: { id: publisherId } })

    const labels = await publisher.getLabels()
    const labelChoices = labels.map(l => ({
      name: l.id.toString(),
      message: l.name,
      value: l.id.toString()
    }))

    const { labelId } = await customAsk([
      {
        type: 'autocomplete',
        name: 'labelId',
        message: 'What label do you want to edit?',
        choices: labelChoices
      }
    ])

    const label = await Label.findOne({ where: { id: labelId } })

    const prompt = require('../../prompts/label')
    const filledPrompt = fillPrompt(prompt, label)

    const result = await customAsk(filledPrompt)
    await label.update(result)

    success(`Label '${result.name}' edited.`)
  }
}
