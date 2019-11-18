module.exports = {
  name: 'edit',
  description: 'Edit a existing publisher in the database',
  run: async toolbox => {
    const {
      print: { success },
      customAsk,
      fillPrompt,
      db: { Publisher, Action, logAction }
    } = toolbox

    const publishers = await Publisher.findAll({ order: [['name', 'ASC']] })
    const publisherChoices = publishers.map(p => ({
      name: p.id.toString(),
      message: p.name,
      value: p.id.toString()
    }))

    const { publisherToEdit } = await customAsk([
      {
        type: 'select',
        name: 'publisherToEdit',
        message: 'What publisher do you want to edit?',
        choices: publisherChoices,
        result: a => parseInt(a)
      }
    ])

    const publisher = await Publisher.findOne({
      where: { id: publisherToEdit }
    })

    const prompt = require('../../prompts/publisher')
    const filledPrompt = fillPrompt(prompt, publisher)

    const result = await customAsk(filledPrompt)
    await Publisher.update(result, { where: { id: publisherToEdit } })

    logAction('Publisher', publisher.id, Action.types.UPDATE)
    success(`Publisher '${result.name}' edited.`)
  }
}
