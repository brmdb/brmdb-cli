const Enquirer = require('enquirer')
const { edit } = require('external-editor')

module.exports = toolbox => {
  let enquirer = null

  class PromptEditor extends Enquirer.Prompt {
    constructor(options) {
      super(options)
      this.value = options.initial || ''
      this.status = 'start'
      this.cursorHide()
    }

    async keypress(input, event = {}) {
      if (this.status === 'pending') return
      await super.keypress(input, event)
    }

    async submit() {
      if (this.status !== 'start') {
        await super.submit()
        return
      }

      this.status = 'pending'
      this.openEditor()
    }

    async hint() {
      const message = this.state.cancelled
        ? 'Cancelled'
        : this.state.submitted
        ? 'Received'
        : 'Press <enter> to launch your preferred editor.'
      return this.styles.muted(message)
    }

    async render() {
      const size = this.state.size

      const prefix = await this.prefix()
      const separator = await this.separator()
      const message = await this.message()

      const header = await this.header()
      const output = (await this.error()) || (await this.hint())
      const footer = await this.footer()

      let prompt = [prefix, message, separator].filter(Boolean).join(' ')
      prompt += ' ' + output
      this.state.prompt = prompt

      this.clear(size)
      this.write([header, prompt, footer].filter(Boolean).join('\n'))
      this.restore()
    }

    async openEditor() {
      if (this.status === 'done') return

      const extension = this.options.extension
        ? '.' + this.options.extension
        : ''

      this.stop()

      try {
        this.value = edit(this.value, { postfix: extension })
        this.status = 'done'
        await this.submit()
      } catch (err) {
        this.status = 'error'
        await this.cancel(err)
      }
    }
  }

  function getEnquirer() {
    if (enquirer) return enquirer

    enquirer = new Enquirer()
    enquirer.register('editor', PromptEditor)

    return enquirer
  }

  toolbox.customAsk = async questions => {
    return getEnquirer().prompt(questions)
  }
}
