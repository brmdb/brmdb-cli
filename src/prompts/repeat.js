const prompt = {
  type: 'toggle',
  name: 'addMore',
  message: 'Do you want to add another creator?',
  enabled: 'Yes',
  disabled: 'No',
  initial: true
}

module.exports = questions => questions.concat([prompt])
