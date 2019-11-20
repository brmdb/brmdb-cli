let enquirer = null

function getEnquirer() {
  if (enquirer) return enquirer

  const Enquirer = require('enquirer')
  enquirer = new Enquirer()
  enquirer.register('editor', require('enquirer-prompt-editor'))

  return enquirer
}

module.exports = toolbox => {
  toolbox.customAsk = async questions => {
    return getEnquirer().prompt(questions)
  }

  // enable this if you want to read configuration in from
  // the current folder's package.json (in a "bmdb-cli" property),
  // bmdb-cli.config.json, etc.
  // toolbox.config = {
  //   ...toolbox.config,
  //   ...toolbox.config.loadConfig(process.cwd(), "bmdb-cli")
  // }
}
