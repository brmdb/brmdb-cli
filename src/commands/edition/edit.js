module.exports = {
  name: 'edit',
  description: 'Edit a existing edition in the database',
  run: async toolbox => {
    const {
      print: { error, success },
      customAsk,
      db: { Edition, ExternalLink, Label },
      customPrompt: {
        fillPrompt,
        selectEditionToEdit,
        askWhatToDoWithExternalLinks,
        promptForExternalLinks,
        selectLinksToRemove
      }
    } = toolbox

    const editionToEdit = await selectEditionToEdit()

    const edition = await Edition.findOne({
      include: [
        { model: ExternalLink, as: 'externalLinks' },
        { model: Label, as: 'label' }
      ],
      where: { id: editionToEdit }
    })

    const editionPrompt = require('../../prompts/edition')([], [])
    const filledPrompt = fillPrompt(editionPrompt.slice(2), edition)

    const editionResult = await customAsk(filledPrompt)
    await edition.update({
      ...editionResult,
      startDate: editionResult.startDate.length
        ? editionResult.startDate
        : null,
      endDate: editionResult.endDate.length ? editionResult.endDate : null
    })

    const linkOption = await askWhatToDoWithExternalLinks()

    if (linkOption !== 'NOTHING') {
      if (linkOption === 'ADD_NEW') {
        const linksToAdd = await promptForExternalLinks()

        for (const linkObj of linksToAdd) {
          const link = await ExternalLink.create(linkObj)
          edition.addExternalLink(link)
        }
      } else {
        if (edition.externalLinks.length > 0) {
          const linksToRemove = await selectLinksToRemove(edition.externalLinks)

          for (const linkId of linksToRemove) {
            const link = await ExternalLink.findByPk(linkId)
            await link.destroy()
          }
        } else {
          error('The edition has no links associated.')
        }
      }
    }

    success(`Edition '${edition.name}' edited.`)
  }
}
