module.exports = {
  name: 'edit',
  description: 'Edit a existing publisher in the database',
  run: async toolbox => {
    const {
      print: { success, error },
      customAsk,
      fillPrompt,
      db: { Publisher, ExternalLink }
    } = toolbox

    const publishers = await Publisher.findAll({ order: [['name', 'ASC']] })
    const publisherChoices = publishers.map(p => ({
      name: p.id.toString(),
      message: p.name,
      value: p.id.toString()
    }))

    const { publisherToEdit } = await customAsk([
      {
        type: 'autocomplete',
        name: 'publisherToEdit',
        message: 'What publisher do you want to edit?',
        choices: publisherChoices
      }
    ])

    const publisher = await Publisher.findOne({
      include: [{ model: ExternalLink, as: 'externalLinks' }],
      where: { id: publisherToEdit }
    })

    const publisherPrompt = require('../../prompts/publisher')
    const filledPrompt = fillPrompt(publisherPrompt, publisher)

    const publisherResult = await customAsk(filledPrompt)
    await publisher.update(publisherResult)

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
        publisher.addExternalLink(link)
      }
    } else {
      const linkChoices = publisher.externalLinks.map(e => ({
        name: e.id.toString(),
        message: e.name,
        value: e.id.toString()
      }))

      if (linkChoices.length === 0) {
        error('The publisher has no links associated.')
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

    success(`Publisher '${publisher.name}' edited.`)
  }
}
