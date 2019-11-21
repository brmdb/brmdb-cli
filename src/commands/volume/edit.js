module.exports = {
  name: 'edit',
  description: 'Edit a existing volume in the database',
  run: async toolbox => {
    const {
      print: { error, success },
      customAsk,
      db: { Person, Volume, VolumePerson },
      customPrompt: {
        fillPrompt,
        selectEditionToEdit,
        selectVolumeToEdit,
        askWhatToDoWithCreators,
        promptForCreators,
        selectCreatorsToRemove
      }
    } = toolbox

    const editionToEdit = await selectEditionToEdit()
    const volumeToEdit = await selectVolumeToEdit(editionToEdit)

    if (!volumeToEdit) {
      error('The edition has no volumes associated.')
      return
    }

    const volume = await Volume.findOne({
      include: [
        {
          model: VolumePerson,
          as: 'involvedPeople',
          include: [{ model: Person, as: 'person' }]
        }
      ],
      where: { id: volumeToEdit }
    })

    const volumePrompt = require('../../prompts/volume')([])
    const filledPrompt = fillPrompt(volumePrompt.slice(1), {
      ...volume.get({ plain: true }),
      registerType: volume.isbn ? 'ISBN' : 'ISSN',
      extrasArray: volume.get('extrasArray').join('|')
    })

    const volumeResult = await customAsk(filledPrompt)
    await volume.update({
      ...volumeResult,
      releaseDate: volumeResult.releaseDate.length
        ? volumeResult.releaseDate
        : null,
      extras: JSON.stringify(volumeResult.extrasArray),
      isbn: volumeResult.isbn.length ? volumeResult.isbn : null,
      issn: volumeResult.issn.length ? volumeResult.issn : null
    })

    const creatorOption = await askWhatToDoWithCreators()

    if (creatorOption !== 'NOTHING') {
      if (creatorOption === 'ADD_NEW') {
        const creatorsToAdd = await promptForCreators(volume.id, 'volumeId')

        for (const creatorObj of creatorsToAdd) {
          await VolumePerson.create(creatorObj)
        }
      } else {
        if (volume.involvedPeople.length > 0) {
          const creatorsToRemove = await selectCreatorsToRemove(
            volume.involvedPeople
          )

          for (const creatorId of creatorsToRemove) {
            const creator = await VolumePerson.findByPk(creatorId)
            await creator.destroy()
          }
        } else {
          error('The volume has no people associated.')
        }
      }
    }

    success(`Volume '#${volume.number} - ${volume.name}' edited with success.`)
  }
}
