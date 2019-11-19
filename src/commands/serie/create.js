module.exports = {
  name: 'create',
  description: 'Create a new serie in the database',
  run: async toolbox => {
    const {
      print: { success },
      customAsk,
      db: { ExternalLink, Person, Serie, SeriePerson }
    } = toolbox

    const seriePrompt = require('../../prompts/serie')

    const result = await customAsk(seriePrompt)
    const serie = await Serie.create({
      ...result,
      alternativeTitles: JSON.stringify(result.synonyms),
      genres: JSON.stringify(result.genresArray)
    })

    const { addLinks } = await customAsk([
      {
        type: 'toggle',
        name: 'addLinks',
        message: 'Do you want to add external links?',
        enabled: 'Yes',
        disabled: 'No',
        initial: true
      }
    ])

    if (addLinks) {
      const linkPrompt = require('../../prompts/externalLink')
      linkPrompt.push({
        type: 'toggle',
        name: 'addMore',
        message: 'Do you want to add another external link?',
        enabled: 'Yes',
        disabled: 'No',
        initial: true
      })

      let linkResult = { addMore: true }
      const linksToAdd = []

      while (linkResult.addMore) {
        linkResult = await customAsk(linkPrompt)
        linksToAdd.push({
          name: linkResult.name,
          type: linkResult.type,
          url: linkResult.url
        })
      }

      for (const linkObj of linksToAdd) {
        const link = await ExternalLink.create(linkObj)
        serie.addExternalLink(link)
      }
    }

    const { addCreators } = await customAsk([
      {
        type: 'toggle',
        name: 'addCreators',
        message: 'Do you want to add creators?',
        enabled: 'Yes',
        disabled: 'No',
        initial: true
      }
    ])

    if (addCreators) {
      const people = await Person.findAll()
      const creatorPrompt = require('../../prompts/creator')(people)
      creatorPrompt.push({
        type: 'toggle',
        name: 'addMore',
        message: 'Do you want to add another creator?',
        enabled: 'Yes',
        disabled: 'No',
        initial: true
      })

      let creatorResult = { addMore: true }
      const creatorsToAdd = []

      while (creatorResult.addMore) {
        creatorResult = await customAsk(creatorPrompt)
        creatorsToAdd.push({
          serieId: serie.id,
          personId: creatorResult.personId,
          role: creatorResult.role
        })
      }

      for (const creatorObj of creatorsToAdd) {
        await SeriePerson.create(creatorObj)
      }
    }

    success(`Serie '${serie.title}' created with id ${serie.id}.`)
  }
}
