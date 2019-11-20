module.exports = {
  name: 'create',
  description: 'Create a new label in the database',
  run: async toolbox => {
    const {
      print: { success },
      customAsk,
      db: { Edition, Label, Publisher, Serie, ExternalLink },
      customPrompt: { askToAddExternalLinks, promptForExternalLinks }
    } = toolbox

    const series = await Serie.findAll({ order: [['title', 'ASC']] })
    const labels = await Label.findAll({
      include: [{ model: Publisher, as: 'publisher' }],
      order: [['name', 'ASC']]
    })

    const prompt = require('../../prompts/edition')(series, labels)
    const result = await customAsk(prompt)
    const edition = await Edition.create({
      ...result,
      startDate: result.startDate.length ? result.startDate : null,
      endDate: result.endDate.length ? result.endDate : null
    })

    const addLinks = await askToAddExternalLinks()

    if (addLinks) {
      const linksToAdd = await promptForExternalLinks()

      for (const linkObj of linksToAdd) {
        const link = await ExternalLink.create(linkObj)
        edition.addExternalLink(link)
      }
    }

    success(`Edition '${edition.name}' created with id ${edition.id}.`)
  }
}
