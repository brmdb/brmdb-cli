module.exports = people => [
  {
    type: 'autocomplete',
    name: 'personId',
    message: 'Who is the person?',
    choices: people.map(p => ({
      name: p.id.toString(),
      message: p.name,
      value: p.id.toString()
    }))
  },
  {
    type: 'input',
    name: 'role',
    message: 'What is the person role?'
  }
]
