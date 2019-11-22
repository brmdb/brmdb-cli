const promptLink = require('../prompts/externalLink')
const promptCreator = require('../prompts/creator')
const makeRepeatable = require('../prompts/repeat')

module.exports = toolbox => {
  const { customAsk, db, strings } = toolbox

  const completePromptLink = makeRepeatable('external link', promptLink)

  function fillPrompt(prompt, modelInstance) {
    return prompt.map(q => {
      if (!modelInstance[q.name]) {
        return q
      }

      const value = modelInstance[q.name]
      return {
        ...q,
        initial:
          value instanceof Date ? value.toISOString().split('T')[0] : value
      }
    })
  }

  async function promptRepeatable(prompt, transform = r => ({})) {
    let result = { addMore: true }
    const modelsToAdd = []

    while (result.addMore) {
      result = await customAsk(prompt)
      modelsToAdd.push(transform(result))
    }

    return modelsToAdd
  }

  async function promptForExternalLinks() {
    return promptRepeatable(completePromptLink, l => ({
      name: l.name,
      type: l.type,
      url: l.url
    }))
  }

  async function promptForCreators(modelId, modelKey = 'serieId') {
    const people = await db.Person.findAll({ order: [['name', 'ASC']] })
    const prompt = makeRepeatable('creator', promptCreator(people))

    return promptRepeatable(prompt, p => ({
      [modelKey]: modelId,
      personId: p.personId,
      role: p.role
    }))
  }

  async function askToAddModel(modelName) {
    const { addModel } = await customAsk([
      {
        type: 'toggle',
        name: 'addModel',
        message: `Do you want to add ${modelName}?`,
        enabled: 'Yes',
        disabled: 'No',
        initial: true
      }
    ])

    return addModel
  }

  async function askToAddExternalLinks() {
    return askToAddModel('external links')
  }

  async function askToAddCreators() {
    return askToAddModel('creators')
  }

  async function askWhatToDoAboutRelation(modelName) {
    const { modelOption } = await customAsk([
      {
        type: 'select',
        name: 'modelOption',
        message: `What you want to do about the ${modelName}?`,
        choices: [
          { name: 'ADD_NEW', message: 'Add new ones', value: '0' },
          { name: 'REMOVE_EXISTING', message: 'Remove existing', value: '1' },
          { name: 'NOTHING', message: 'Nothing', value: '2' }
        ]
      }
    ])

    return modelOption
  }

  async function askWhatToDoWithExternalLinks() {
    return askWhatToDoAboutRelation('external links')
  }

  async function askWhatToDoWithCreators() {
    return askWhatToDoAboutRelation('creators')
  }

  async function selectModelToEdit(
    model,
    modelName,
    messageField = 'name',
    choiceMessage = i => i.name,
    options = {}
  ) {
    const instances = await model.findAll({
      order: [[messageField, 'ASC']],
      ...options
    })

    if (instances.length === 0) {
      return undefined
    }

    const { modelToEdit } = await customAsk({
      type: 'autocomplete',
      name: 'modelToEdit',
      message: `What ${modelName} do you want to edit?`,
      choices: instances.map(i => ({
        name: i.id.toString(),
        message: choiceMessage(i),
        value: i.id.toString()
      }))
    })

    return modelToEdit
  }

  async function selectPublisherToEdit() {
    return selectModelToEdit(db.Publisher, 'publisher')
  }

  async function selectLabelToEdit() {
    return selectModelToEdit(
      db.Label,
      'label',
      'name',
      l => `${l.name} (${l.publisher.name})`,
      { include: [{ model: db.Publisher, as: 'publisher' }] }
    )
  }

  async function selectPersonToEdit() {
    return selectModelToEdit(db.Person, 'person')
  }

  async function selectSerieToEdit() {
    return selectModelToEdit(
      db.Serie,
      'serie',
      'title',
      s =>
        s.title +
        (s.type === 'MANGA'
          ? ''
          : ` (${strings.startCase(strings.lowerCase(s.type))})`)
    )
  }

  async function selectEditionToEdit() {
    return selectModelToEdit(
      db.Edition,
      'edition',
      'name',
      e =>
        `${e.serie.title}${
          e.serie.type === 'MANGA'
            ? ''
            : ` ${strings.startCase(strings.lowerCase(e.serie.type))}`
        } - ${e.name} (${e.label.publisher.name})`,
      {
        include: [
          { model: db.Serie, as: 'serie' },
          {
            model: db.Label,
            as: 'label',
            include: [{ model: db.Publisher, as: 'publisher' }]
          }
        ]
      }
    )
  }

  async function selectVolumeToEdit(editionId) {
    return selectModelToEdit(
      db.Volume,
      'volume',
      '',
      i => `#${i.number} - ${i.name}`,
      {
        order: [
          [db.sequelize.literal('volume.number * 1')],
          [db.sequelize.literal('volume.number')]
        ],
        include: [
          { model: db.Edition, as: 'edition', where: { id: editionId } }
        ]
      }
    )
  }

  async function selectInstancesToRemove(
    instances,
    modelName,
    messageField = i => i.name
  ) {
    const { instancesToRemove } = await customAsk([
      {
        type: 'multiselect',
        name: 'instancesToRemove',
        message: `Select the ${modelName} to remove`,
        choices: instances.map(i => ({
          name: i.id.toString(),
          message: messageField(i),
          value: i.id.toString()
        }))
      }
    ])

    return instancesToRemove
  }

  async function selectLinksToRemove(links) {
    return selectInstancesToRemove(links, 'links')
  }

  async function selectCreatorsToRemove(creators) {
    return selectInstancesToRemove(
      creators,
      'creators',
      e => `${e.person.name} (${e.role})`
    )
  }

  toolbox.customPrompt = {
    fillPrompt,
    askToAddExternalLinks,
    askToAddCreators,
    askWhatToDoWithExternalLinks,
    askWhatToDoWithCreators,
    promptForExternalLinks,
    promptForCreators,
    selectPublisherToEdit,
    selectLabelToEdit,
    selectPersonToEdit,
    selectSerieToEdit,
    selectEditionToEdit,
    selectVolumeToEdit,
    selectLinksToRemove,
    selectCreatorsToRemove
  }
}
