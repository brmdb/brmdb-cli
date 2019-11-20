module.exports = {
  name: 'edit',
  description: 'Edit a existing publisher in the database',
  run: async toolbox => {
    const {
      print: { success, error },
      customAsk,
      db: { Publisher, ExternalLink },
      customPrompt: {
        fillPrompt,
        askWhatToDoWithExternalLinks,
        promptForExternalLinks,
        selectPublisherToEdit,
        selectLinksToRemove
      }
    } = toolbox

    const publisherToEdit = await selectPublisherToEdit()

    const publisher = await Publisher.findOne({
      include: [{ model: ExternalLink, as: 'externalLinks' }],
      where: { id: publisherToEdit }
    })

    const publisherPrompt = require('../../prompts/publisher')
    const filledPrompt = fillPrompt(publisherPrompt, publisher)

    const publisherResult = await customAsk(filledPrompt)
    await publisher.update(publisherResult)

    const linkOption = await askWhatToDoWithExternalLinks()

    if (linkOption !== 'NOTHING') {
      if (linkOption === 'ADD_NEW') {
        const linksToAdd = await promptForExternalLinks()

        for (const linkObj of linksToAdd) {
          const link = await ExternalLink.create(linkObj)
          publisher.addExternalLink(link)
        }
      } else {
        if (publisher.externalLinks.length > 0) {
          const linksToRemove = await selectLinksToRemove(
            publisher.externalLinks
          )

          for (const linkId of linksToRemove) {
            const link = await ExternalLink.findByPk(linkId)
            await link.destroy()
          }
        } else {
          error('The publisher has no links associated.')
        }
      }
    }

    success(`Publisher '${publisher.name}' edited.`)
  }
}
