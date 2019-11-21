module.exports = {
  name: 'edit',
  description: 'Edit a existing serie in the database',
  run: async toolbox => {
    const {
      print: { error, success },
      customAsk,
      db: { ExternalLink, Person, Serie, SeriePerson },
      customPrompt: {
        fillPrompt,
        selectSerieToEdit,
        askWhatToDoWithExternalLinks,
        askWhatToDoWithCreators,
        promptForExternalLinks,
        promptForCreators,
        selectLinksToRemove,
        selectCreatorsToRemove
      }
    } = toolbox

    const serieToEdit = await selectSerieToEdit()

    const serie = await Serie.findOne({
      include: [
        { model: ExternalLink, as: 'externalLinks' },
        {
          model: SeriePerson,
          as: 'creators',
          include: [{ model: Person, as: 'person' }]
        }
      ],
      where: { id: serieToEdit }
    })

    const seriePrompt = require('../../prompts/serie')
    const filledPrompt = fillPrompt(seriePrompt, serie)

    const serieResult = await customAsk(filledPrompt)
    await serie.update({
      ...serieResult,
      alternativeTitles: JSON.stringify(serieResult.synonyms),
      genres: JSON.stringify(serieResult.genresArray)
    })

    const linkOption = await askWhatToDoWithExternalLinks()

    if (linkOption !== 'NOTHING') {
      if (linkOption === 'ADD_NEW') {
        const linksToAdd = await promptForExternalLinks()

        for (const linkObj of linksToAdd) {
          const link = await ExternalLink.create(linkObj)
          serie.addExternalLink(link)
        }
      } else {
        if (serie.externalLinks.length > 0) {
          const linksToRemove = await selectLinksToRemove(serie.externalLinks)

          for (const linkId of linksToRemove) {
            const link = await ExternalLink.findByPk(linkId)
            await link.destroy()
          }
        } else {
          error('The serie has no links associated.')
        }
      }
    }

    const creatorOption = await askWhatToDoWithCreators()

    if (creatorOption !== 'NOTHING') {
      if (creatorOption === 'ADD_NEW') {
        const creatorsToAdd = await promptForCreators(serie.id)

        for (const creatorObj of creatorsToAdd) {
          await SeriePerson.create(creatorObj)
        }
      } else {
        if (serie.creators.length > 0) {
          const creatorsToRemove = await selectCreatorsToRemove(serie.creators)

          for (const creatorId of creatorsToRemove) {
            const creator = await SeriePerson.findByPk(creatorId)
            await creator.destroy()
          }
        } else {
          error('The serie has no creators associated.')
        }
      }
    }

    success(`Serie '${serie.title}' edited with success.`)
  }
}
