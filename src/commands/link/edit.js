module.exports = {
  name: 'edit',
  description: 'Edit a existing link in the database',
  run: async toolbox => {
    const {
      parameters,
      print: { success, error },
      customAsk,
      db: { ExternalLink },
      customPrompt: { fillPrompt }
    } = toolbox

    if (!parameters.first) {
      error('You need to specify an id.')
      return
    }

    const link = await ExternalLink.findByPk(parameters.first)
    if (!link) {
      error(`A link with id ${parameters.first} does not exists.`)
      return
    }

    const prompt = require('../../prompts/externalLink')
    const filledPrompt = fillPrompt(prompt, link)

    const result = await customAsk(filledPrompt)
    await link.update(result)

    success(`Link '${link.name}' edited.`)
  }
}
