const prompt = model => ({
  type: 'toggle',
  name: 'addMore',
  message: `Do you want to add another ${model}?`,
  enabled: 'Yes',
  disabled: 'No',
  initial: true
})

module.exports = (model, questions) => questions.concat([prompt(model)])
