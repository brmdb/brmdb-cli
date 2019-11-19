module.exports = {
  name: 'edit',
  description: 'Edit a existing serie in the database',
  run: async toolbox => {
    const {
      print: { error, success },
      customAsk,
      fillPrompt,
      db: { ExternalLink, Person, Serie, SeriePerson }
    } = toolbox

    const series = await Serie.findAll({ order: [['title', 'ASC']] })
    const seriesCoices = series.map(p => ({
      name: p.title,
      message: p.title,
      value: p.id.toString()
    }))

    const { serieToEdit } = await customAsk([
      {
        type: 'autocomplete',
        name: 'serieToEdit',
        message: 'What serie do you want to edit?',
        choices: seriesCoices
      }
    ])

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

    const { linkOption } = await customAsk([
      {
        type: 'select',
        name: 'linkOption',
        message: 'What you want to do about the external links?',
        choices: [
          { name: 'ADD_NEW', message: 'Add new ones', value: '0' },
          { name: 'REMOVE_EXISTING', message: 'Remove existing', value: '1' },
          { name: 'NOTHING', message: 'Nothing', value: '2' }
        ]
      }
    ])

    if (linkOption !== 'NOTHING') {
      if (linkOption === 'ADD_NEW') {
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
      } else {
        const linkChoices = serie.externalLinks.map(e => ({
          name: e.id.toString(),
          message: e.name,
          value: e.id.toString()
        }))

        if (linkChoices.length === 0) {
          error('The serie has no links associated.')
          return
        }

        const { linksToRemove } = await customAsk([
          {
            type: 'multiselect',
            name: 'linksToRemove',
            message: 'Select the links to remove',
            choices: linkChoices
          }
        ])

        for (const linkId of linksToRemove) {
          const link = await ExternalLink.findByPk(linkId)
          await link.destroy()
        }
      }
    }

    const { creatorOption } = await customAsk([
      {
        type: 'select',
        name: 'creatorOption',
        message: 'What you want to do about the creators?',
        choices: [
          { name: 'ADD_NEW', message: 'Add new ones', value: '0' },
          { name: 'REMOVE_EXISTING', message: 'Remove existing', value: '1' },
          { name: 'NOTHING', message: 'Nothing', value: '2' }
        ]
      }
    ])

    if (creatorOption !== 'NOTHING') {
      if (creatorOption === 'ADD_NEW') {
        const allPeople = await Person.findAll()
        const creatorPrompt = require('../../prompts/creator')(allPeople)
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
      } else {
        const creatorChoices = serie.creators.map(e => ({
          name: e.id.toString(),
          message: `${e.person.name} (${e.role})`,
          value: e.id.toString()
        }))

        if (creatorChoices.length === 0) {
          error('The serie has no creators associated.')
          return
        }

        const { creatorsToRemove } = await customAsk([
          {
            type: 'multiselect',
            name: 'creatorsToRemove',
            message: 'Select the creators to remove',
            choices: creatorChoices
          }
        ])

        for (const creatorId of creatorsToRemove) {
          const creator = await SeriePerson.findByPk(creatorId)
          await creator.destroy()
        }
      }
    }

    success(`Serie '${serie.title}' edited with success.`)
  }
}
