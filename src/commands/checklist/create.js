module.exports = {
  name: 'create',
  description: 'Create a new checklist in the database',
  run: async toolbox => {
    const {
      print: { success },
      customAsk,
      db: { Checklist, Label, Publisher }
    } = toolbox

    const labels = await Label.findAll({
      include: [{ model: Publisher, as: 'publisher' }],
      order: [['name', 'ASC']]
    })

    const prompt = require('../../prompts/checklist')(labels)
    const result = await customAsk(prompt)
    const checklist = await Checklist.create(result)

    success(`Checklist created with id ${checklist.id}.`)
  }
}
