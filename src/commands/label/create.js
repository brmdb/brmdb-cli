module.exports = {
  name: 'create',
  description: 'Create a new label in the database',
  run: async toolbox => {
    const {
      print: { success },
      customAsk,
      db: { Publisher }
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
        message: 'What publisher does this label belongs to?',
        choices: publisherChoices
      }
    ])

    const publisher = await Publisher.findOne({ where: { id: publisherId } })

    const prompt = require('../../prompts/label')

    const result = await customAsk(prompt)
    const label = await publisher.createLabel(result)

    success(`Label '${label.name}' created with id ${label.id}.`)
  }
}
