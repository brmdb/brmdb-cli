module.exports = (series, labels) => [
  {
    type: 'autocomplete',
    name: 'serieId',
    message: 'From what serie is this edition?',
    choices: series.map(s => ({
      name: s.id.toString(),
      message: s.title,
      value: s.id.toString()
    }))
  },
  {
    type: 'autocomplete',
    name: 'labelId',
    message: 'What publishing label does this edition belongs?',
    choices: labels.map(l => ({
      name: l.id.toString(),
      message: `${l.name} (${l.publisher.name})`,
      value: l.id.toString()
    }))
  },
  {
    type: 'input',
    name: 'name',
    message: "What is the edition's name?"
  },
  {
    type: 'select',
    name: 'type',
    message: "What is the edition's type?",
    choices: [
      { name: 'NORMAL', message: 'Normal', value: 'NORMAL' },
      { name: 'DELUXE', message: 'Deluxe', value: 'DELUXE' }
    ]
  },
  {
    type: 'input',
    name: 'paper',
    message: 'What is the type of paper used?'
  },
  {
    type: 'select',
    name: 'cover',
    message: 'What is the cover type?',
    choices: [
      { name: 'SOFT', message: 'Softcover', value: 'SOFT' },
      { name: 'HARD', message: 'Hardcover', value: 'HARD' }
    ]
  },
  {
    type: 'select',
    name: 'bindingType',
    message: 'What is the binding type?',
    choices: [
      {
        name: 'PERFECT_BOUND',
        message: 'Perfect Bound',
        value: 'PERFECT_BOUND'
      },
      {
        name: 'SADDLE_STITCHED',
        message: 'Saddle Stitched',
        value: 'SADDLE_STITCHED'
      },
      {
        name: 'CASE_BOUND',
        message: 'Case Bound',
        value: 'CASE_BOUND'
      }
    ]
  },
  {
    type: 'input',
    name: 'dimensions',
    message: "What are the edition's dimensions (in cm)?"
  },
  {
    type: 'toggle',
    name: 'hasJacket',
    message: 'Does the edition have jackets?',
    enabled: 'Yes',
    disabled: 'No',
    initial: false
  },
  {
    type: 'select',
    name: 'status',
    message: 'What is the status of the edition?',
    choices: [
      {
        name: 'ANNOUNCED',
        message: 'Announced by the publisher, but not released yet',
        value: 'ANNOUNCED'
      },
      {
        name: 'PUBLISHING',
        message: 'Currently publishing within some defined period',
        value: 'PUBLISHING'
      },
      {
        name: 'FINISHED',
        message: 'Has already finished',
        value: 'FINISHED'
      },
      {
        name: 'CANCELLED',
        message: 'Cancelled by the publisher',
        value: 'CANCELLED'
      },
      {
        name: 'UNKNOWN',
        message: 'There is no more statements by the publisher',
        value: 'UNKNOWN'
      }
    ]
  },
  {
    type: 'select',
    name: 'period',
    message: 'What is the publishing period?',
    choices: [
      { name: 'MONTHLY', message: 'Monthly', value: 'MONTHLY' },
      { name: 'BIMONTHLY', message: 'Bimonthly', value: 'BIMONTHLY' },
      { name: 'TRIMONTHLY', message: 'Trimonthly', value: 'TRIMONTHLY' },
      {
        name: 'QUADRIMONTHLY',
        message: 'Quadrimonthly',
        value: 'QUADRIMONTHLY'
      },
      {
        name: 'UNDEFINED',
        message: 'There is no constant period',
        value: 'UNDEFINED'
      }
    ]
  },
  {
    type: 'input',
    name: 'startDate',
    message: 'When this edition started? (yyyy-mm-dd)'
  },
  {
    type: 'input',
    name: 'endDate',
    message: 'When this edition finished? (yyyy-mm-dd)'
  }
]
