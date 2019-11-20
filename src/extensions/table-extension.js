module.exports = toolbox => {
  const {
    strings: { marked, kebabCase, upperFirst }
  } = toolbox

  const Table = require('cli-table3')

  toolbox.print.customTable = (data, options = {}) => {
    const t = new Table(options)
    t.push(...data)
    console.log(t.toString())
  }

  function customUpperFirst(str) {
    return upperFirst(kebabCase(str).replace('-', ' ')).replace(/id/i, 'ID')
  }

  toolbox.print.tabulateInstance = (
    instance,
    textProperties = [],
    options = {}
  ) => {
    const tableHeader = ['Attribute', 'Value']
    const tableData = Object.entries(instance.dataValues)
      .filter(
        ([k, v]) => v instanceof Date || v === null || typeof v !== 'object'
      )
      .map(p => (textProperties.includes(p[0]) ? [p[0], marked(p[1])] : p))
      .map(([k, v]) => [
        customUpperFirst(k),
        v instanceof Date ? v.toISOString() : v
      ])
    toolbox.print.customTable([tableHeader].concat(tableData), {
      colWidths: textProperties.length > 0 ? [null, 60] : [],
      wordWrap: true,
      ...options
    })
  }

  const get = require('lodash.get')

  toolbox.print.listInstances = (
    instances,
    attributes,
    colWidths = [],
    options = {}
  ) => {
    const tableHeader = attributes.map(k =>
      typeof k === 'object' ? k.head : customUpperFirst(k.replace('.', ' '))
    )
    const tableData = instances.map(i =>
      attributes.map(k => get(i, typeof k === 'object' ? k.path : k))
    )
    toolbox.print.customTable([tableHeader].concat(tableData), {
      ...options,
      colWidths
    })
  }
}
