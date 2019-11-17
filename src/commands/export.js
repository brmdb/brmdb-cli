module.exports = {
  name: 'export',
  description: 'Export the entire database into the project format',
  run: async toolbox => {
    const {
      print: { info, success, debug },
      filesystem,
      exportModels,
      db: { Publisher }
    } = toolbox

    const outputFolder = filesystem.path('public')
    filesystem.remove(outputFolder)
    filesystem.dir(outputFolder).dir('publishers')

    await exportModels.publisher(filesystem.path(outputFolder, 'publishers'))
  }
}
