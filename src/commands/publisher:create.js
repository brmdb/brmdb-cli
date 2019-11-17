module.exports = {
  name: 'publisher:create',
  description: 'Create a new publisher in the database',
  run: async toolbox => {
    const {
      print: { success },
      customAsk,
      db: { Publisher }
    } = toolbox

    const prompt = require('../prompts/publisher')

    const result = await customAsk(prompt)
    const publisher = await Publisher.create(result)

    success(`Publisher '${publisher.name}' created with id ${publisher.id}.`)
  }
}
