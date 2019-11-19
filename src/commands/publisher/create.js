module.exports = {
  name: 'create',
  description: 'Create a new publisher in the database',
  run: async toolbox => {
    const {
      print: { success },
      customAsk,
      db: { Publisher, ExternalLink }
    } = toolbox

    const prompt = require('../../prompts/publisher')

    const result = await customAsk(prompt)
    const publisher = await Publisher.create(result)

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
      success(`Publisher '${publisher.name}' created with id ${publisher.id}.`)
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
      publisher.addExternalLink(link)
    }

    success(`Publisher '${publisher.name}' created with id ${publisher.id}.`)
  }
}
