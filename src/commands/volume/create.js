module.exports = {
  name: 'create',
  description: 'Create a new volume in the database',
  run: async toolbox => {
    const {
      print: { success },
      customAsk,
      db: { Edition, Serie, Volume, VolumePerson },
      customPrompt: { askToAddCreators, promptForCreators }
    } = toolbox

    const series = await Serie.findAll({
      order: [
        ['title', 'ASC'],
        [{ model: Edition, as: 'editions' }, 'name', 'ASC']
      ],
      include: [{ model: Edition, as: 'editions' }]
    })

    const prompt = require('../../prompts/volume')(series)
    const result = await customAsk(prompt)
    const volume = await Volume.create({
      ...result,
      releaseDate: result.releaseDate.length ? result.releaseDate : null,
      extras: JSON.stringify(result.extrasArray),
      isbn: result.isbn.length ? result.isbn : null,
      issn: result.issn.length ? result.issn : null
    })

    const addCreators = await askToAddCreators()

    if (addCreators) {
      const creatorsToAdd = await promptForCreators(volume.id, 'volumeId')

      for (const creatorObj of creatorsToAdd) {
        await VolumePerson.create(creatorObj)
      }
    }

    success(
      `Volume '#${volume.number} - ${volume.name}' created with id ${volume.id}`
    )
  }
}
