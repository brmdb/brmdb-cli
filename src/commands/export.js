module.exports = {
  name: 'export',
  description: 'Export the entire database into the project format',
  run: async toolbox => {
    const {
      print: { success },
      filesystem,
      exportData
    } = toolbox

    const outputFolder = filesystem.path('dist')
    filesystem.remove(outputFolder)
    filesystem.dir(outputFolder)

    await exportData(outputFolder, [
      'Publisher',
      'Label',
      'Serie',
      'Edition',
      'Volume',
      'Person',
      'Action',
      'Checklist'
    ])
    success('Database exported with success.')
  }
}
