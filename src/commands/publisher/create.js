module.exports = {
  name: 'create',
  description: 'Create a new publisher in the database',
  run: async toolbox => {
    const {
      print: { success },
      customAsk,
      db: { Publisher, Action, logAction }
    } = toolbox

    const prompt = require('../../prompts/publisher')

    const result = await customAsk(prompt)
    const publisher = await Publisher.create(result)

    logAction('Publisher', publisher.id, Action.types.CREATE)
    success(`Publisher '${publisher.name}' created with id ${publisher.id}.`)
  }
}
