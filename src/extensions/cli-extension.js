module.exports = toolbox => {
  const marked = require('marked')
  const TerminalRenderer = require('marked-terminal')
  marked.setOptions({ renderer: new TerminalRenderer() })

  toolbox.strings.marked = md => (md ? marked(md) : '')

  // enable this if you want to read configuration in from
  // the current folder's package.json (in a "bmdb-cli" property),
  // bmdb-cli.config.json, etc.
  // toolbox.config = {
  //   ...toolbox.config,
  //   ...toolbox.config.loadConfig(process.cwd(), "bmdb-cli")
  // }
}
