module.exports = {
  name: 'edit',
  description: 'Edit a existing person in the database',
  run: async toolbox => {
    const {
      print: { error, success },
      customAsk,
      fillPrompt,
      db: { ExternalLink, Person }
    } = toolbox

    const people = await Person.findAll({ order: [['name', 'ASC']] })
    const peopleChoices = people.map(p => ({
      name: p.name,
      message: p.name,
      value: p.id.toString()
    }))

    const { personToEdit } = await customAsk([
      {
        type: 'autocomplete',
        name: 'personToEdit',
        message: 'What person do you want to edit?',
        choices: peopleChoices
      }
    ])

    const person = await Person.findOne({
      include: [{ model: ExternalLink, as: 'externalLinks' }],
      where: { id: personToEdit }
    })

    const personPrompt = require('../../prompts/person')
    const filledPrompt = fillPrompt(personPrompt, person)

    const personResult = await customAsk(filledPrompt)
    await person.update(personResult)

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

    if (linkOption === 'NOTHING') return

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
        person.addExternalLink(link)
      }
    } else {
      const linkChoices = person.externalLinks.map(e => ({
        name: e.id.toString(),
        message: e.name,
        value: e.id.toString()
      }))

      if (linkChoices.length === 0) {
        error('The person has no links associated.')
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

    success(`Person '${person.name}' edited with success.`)
  }
}
