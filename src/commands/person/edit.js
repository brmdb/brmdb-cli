module.exports = {
  name: 'edit',
  description: 'Edit a existing person in the database',
  run: async toolbox => {
    const {
      print: { error, success },
      customAsk,
      db: { ExternalLink, Person },
      customPrompt: {
        fillPrompt,
        selectPersonToEdit,
        askWhatToDoWithExternalLinks,
        promptForExternalLinks,
        selectLinksToRemove
      }
    } = toolbox

    const personToEdit = await selectPersonToEdit()

    const person = await Person.findOne({
      include: [{ model: ExternalLink, as: 'externalLinks' }],
      where: { id: personToEdit }
    })

    const personPrompt = require('../../prompts/person')
    const filledPrompt = fillPrompt(personPrompt, person)

    const personResult = await customAsk(filledPrompt)
    await person.update(personResult)

    const linkOption = await askWhatToDoWithExternalLinks()

    if (linkOption !== 'NOTHING') {
      if (linkOption === 'ADD_NEW') {
        const linksToAdd = await promptForExternalLinks()

        for (const linkObj of linksToAdd) {
          const link = await ExternalLink.create(linkObj)
          person.addExternalLink(link)
        }
      } else {
        if (person.externalLinks.length > 0) {
          const linksToRemove = await selectLinksToRemove(person.externalLinks)

          for (const linkId of linksToRemove) {
            const link = await ExternalLink.findByPk(linkId)
            await link.destroy()
          }
        } else {
          error('The person has no links associated.')
        }
      }
    }

    success(`Person '${person.name}' edited.`)
  }
}
