module.exports = {
  name: 'export',
  description: 'Export the entire database into the project format',
  run: async toolbox => {
    const {
      print: { success },
      filesystem,
      exportModels
    } = toolbox

    const outputFolder = filesystem.path('public')
    filesystem.remove(outputFolder)
    filesystem.dir(outputFolder)

    await exportModels.publisher(filesystem.path(outputFolder, 'publishers'))
    await exportModels.action(filesystem.path(outputFolder, 'actions'))
    await exportModels.label(filesystem.path(outputFolder, 'labels'))
    success('Database exported with success.')
  }
}
