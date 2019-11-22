module.exports = {
  name: 'create',
  description: 'Create a new person in the database',
  run: async toolbox => {
    const {
      print: { success },
      customAsk,
      db: { ExternalLink, Person },
      customPrompt: { askToAddExternalLinks, promptForExternalLinks }
    } = toolbox

    const personPrompt = require('../../prompts/person')

    const result = await customAsk(personPrompt)
    const person = await Person.create(result)

    const addLinks = await askToAddExternalLinks()

    if (addLinks) {
      const linksToAdd = await promptForExternalLinks()

      for (const linkObj of linksToAdd) {
        const link = await ExternalLink.create(linkObj)
        person.addExternalLink(link)
      }
    }

    success(`Person '${person.name}' created with id ${person.id}.`)
  }
}
