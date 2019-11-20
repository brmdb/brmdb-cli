module.exports = {
  name: 'export',
  description: 'Export the entire database into the project format',
  run: async toolbox => {
    const {
      print: { success },
      filesystem,
      exportData
    } = toolbox

    const outputFolder = filesystem.path('public')
    filesystem.remove(outputFolder)
    filesystem.dir(outputFolder)

    await exportData(outputFolder, [
      'Publisher',
      'Label',
      'Serie',
      'Edition',
      'Person',
      'Action'
    ])
    success('Database exported with success.')
  }
}
