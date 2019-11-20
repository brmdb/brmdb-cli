module.exports = {
  name: 'create',
  description: 'Create a new serie in the database',
  run: async toolbox => {
    const {
      print: { success },
      customAsk,
      db: { ExternalLink, Serie, SeriePerson },
      customPrompt: {
        askToAddExternalLinks,
        askToAddCreators,
        promptForExternalLinks,
        promptForCreators
      }
    } = toolbox

    const seriePrompt = require('../../prompts/serie')

    const result = await customAsk(seriePrompt)
    const serie = await Serie.create({
      ...result,
      alternativeTitles: JSON.stringify(result.synonyms),
      genres: JSON.stringify(result.genresArray)
    })

    const addLinks = await askToAddExternalLinks()

    if (addLinks) {
      const linksToAdd = await promptForExternalLinks()

      for (const linkObj of linksToAdd) {
        const link = await ExternalLink.create(linkObj)
        serie.addExternalLink(link)
      }
    }

    const addCreators = await askToAddCreators()

    if (addCreators) {
      const creatorsToAdd = await promptForCreators()

      for (const creatorObj of creatorsToAdd) {
        await SeriePerson.create(creatorObj)
      }
    }

    success(`Serie '${serie.title}' created with id ${serie.id}.`)
  }
}
