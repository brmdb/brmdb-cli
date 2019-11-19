module.exports = {
  name: 'edit',
  description: 'Edit a existing publisher in the database',
  run: async toolbox => {
    const {
      print: { success },
      customAsk,
      fillPrompt,
      db: { Publisher }
    } = toolbox

    const publishers = await Publisher.findAll({ order: [['name', 'ASC']] })
    const publisherChoices = publishers.map(p => ({
      name: p.id.toString(),
      message: p.name,
      value: p.id.toString()
    }))

    const { publisherToEdit } = await customAsk([
      {
        type: 'autocomplete',
        name: 'publisherToEdit',
        message: 'What publisher do you want to edit?',
        choices: publisherChoices
      }
    ])

    const publisher = await Publisher.findOne({
      where: { id: publisherToEdit }
    })

    const prompt = require('../../prompts/publisher')
    const filledPrompt = fillPrompt(prompt, publisher)

    const result = await customAsk(filledPrompt)
    await publisher.update(result)

    success(`Publisher '${result.name}' edited.`)
  }
}
