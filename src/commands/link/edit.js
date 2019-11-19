module.exports = {
  name: 'edit',
  description: 'Edit a existing link in the database',
  run: async toolbox => {
    const {
      parameters: { options },
      print: { success, error },
      customAsk,
      fillPrompt,
      db: { ExternalLink }
    } = toolbox

    if (!options.id) {
      error('You need to specify an id with the --id option.')
      return
    }

    const link = await ExternalLink.findByPk(options.id)
    if (!link) {
      error(`A link with id ${options.id} does not exists.`)
      return
    }

    const prompt = require('../../prompts/externalLink')
    const filledPrompt = fillPrompt(prompt, link)

    const result = await customAsk(filledPrompt)
    await link.update(result)

    success(`Link '${link.name}' edited.`)
  }
}
