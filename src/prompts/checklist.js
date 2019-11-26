module.exports = labels => [
  {
    type: 'select',
    name: 'month',
    message: "What is the checklist's month?",
    choices: [
      { name: '1', message: 'January', value: '1' },
      { name: '2', message: 'February', value: '2' },
      { name: '3', message: 'March', value: '3' },
      { name: '4', message: 'April', value: '4' },
      { name: '5', message: 'May', value: '5' },
      { name: '6', message: 'June', value: '6' },
      { name: '7', message: 'July', value: '7' },
      { name: '8', message: 'August', value: '8' },
      { name: '9', message: 'September', value: '9' },
      { name: '10', message: 'October', value: '10' },
      { name: '11', message: 'November', value: '11' },
      { name: '12', message: 'December', value: '12' }
    ],
    result: v => parseInt(v)
  },
  {
    type: 'numeral',
    name: 'year',
    message: "What is the checklist's year?"
  },
  {
    type: 'autocomplete',
    name: 'labelId',
    message: 'From what label is this checklist?',
    choices: labels.map(l => ({
      name: l.id.toString(),
      message: `${l.name} (${l.publisher.name})`,
      value: l.id.toString()
    }))
  },
  {
    type: 'editor',
    name: 'observation',
    message: 'Is there any observation?',
    extension: 'md'
  }
]
