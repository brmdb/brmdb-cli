module.exports = {
  name: 'restore',
  run: async toolbox => {
    const { db, filesystem, parameters, print } = toolbox

    const files = [
      'ExternalLinks',
      'Publishers',
      'PublisherExternalLinks',
      'Labels',
      'People',
      'PersonExternalLinks',
      'Series',
      'SerieExternalLinks',
      'SeriePeople',
      'Editions',
      'EditionExternalLinks',
      'Volumes',
      'VolumePeople',
      'Actions'
    ]

    const newFields = {
      Labels: { logoUrl: '' },
      People: { imageUrl: '' },
      Publishers: { logoUrl: '', bannerUrl: '' },
      Series: { posterUrl: '', bannerUrl: '' },
      Volumes: { coverUrl: '' }
    }

    for (const file of files) {
      const path = filesystem.path(parameters.first, file + '.json')
      const content = await filesystem.read(path, 'json')
      const table = file
      const columns = Object.keys(content[0])
        .concat(newFields[table] ? Object.keys(newFields[table]) : [])
        .join(', ')
      const emptyValues = newFields[table]
        ? Object.values(newFields[table])
        : []

      for (const register of content) {
        console.log(`Inserting in ${table} id ${register.id}`)
        await db.sequelize.query(`
          INSERT INTO ${table} (${columns}) VALUES
            (${JSON.stringify(Object.values(register).concat(emptyValues))
              .replace(/\\"/g, '""')
              .replace(/\\n/g, '\n')
              .slice(1, -1)});
        `)
      }
    }

    print.info('Welcome to your CLI')
  }
}
