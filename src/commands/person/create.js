module.exports = {
  name: 'create',
  description: 'Create a new person in the database',
  run: async toolbox => {
    const {
      print: { success },
      customAsk,
      db: { ExternalLink, Person }
    } = toolbox

    const personPrompt = require('../../prompts/person')

    const result = await customAsk(personPrompt)
    const person = await Person.create(result)

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

    if (!addLinks) {
      success(`Person '${person.name}' created with id ${person.id}.`)
      return
    }

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

    success(`Person '${person.name}' created with id ${person.id}.`)
  }
}
