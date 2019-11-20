module.exports = {
  name: 'create',
  description: 'Create a new publisher in the database',
  run: async toolbox => {
    const {
      print: { success },
      customAsk,
      db: { Publisher, ExternalLink },
      customPrompt: { askToAddExternalLinks, promptForExternalLinks }
    } = toolbox

    const prompt = require('../../prompts/publisher')

    const result = await customAsk(prompt)
    const publisher = await Publisher.create(result)

    const addLinks = await askToAddExternalLinks()

    if (addLinks) {
      const linksToAdd = await promptForExternalLinks()

      for (const linkObj of linksToAdd) {
        const link = await ExternalLink.create(linkObj)
        publisher.addExternalLink(link)
      }
    }

    success(`Publisher '${publisher.name}' created with id ${publisher.id}.`)
  }
}
