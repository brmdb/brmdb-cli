module.exports = [
  {
    type: 'input',
    name: 'name',
    message: 'What is the link name?'
  },
  {
    type: 'select',
    name: 'type',
    message: 'What is the link type?',
    choices: [
      { name: 'SOCIAL', message: 'Social media', value: 'SOCIAL' },
      { name: 'DATABASE', message: 'Database website', value: 'DATABASE' },
      {
        name: 'INFORMATION',
        message: 'General information',
        value: 'INFORMATION'
      },
      { name: 'STORE', message: 'Store', value: 'STORE' },
      { name: 'VIDEO', message: 'Video', value: 'VIDEO' }
    ]
  },
  {
    type: 'input',
    name: 'url',
    message: 'What is the link url?'
  }
]
