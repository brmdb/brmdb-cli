module.exports = [
  {
    type: 'input',
    name: 'title',
    message: "What is the serie's title?"
  },
  {
    type: 'list',
    name: 'synonyms',
    message: 'What are the alternative titles?',
    separator: /; */
  },
  {
    type: 'editor',
    name: 'synopsis',
    message: "What is the serie's synopsis?",
    extension: 'md'
  },
  {
    type: 'select',
    name: 'status',
    message: "What is the serie's status (in country of origin)?",
    choices: [
      { name: 'FINISHED', message: 'Finished', value: 'FINISHED' },
      { name: 'PUBLISHING', message: 'Publishing', value: 'PUBLISHING' },
      { name: 'HIATUS', message: 'Hiatus', value: 'HIATUS' }
    ]
  },
  {
    type: 'select',
    name: 'type',
    message: 'What is the type of the series?',
    choices: [
      { name: 'MANGA', message: 'Manga', value: 'MANGA' },
      { name: 'MANHWA', message: 'Manhwa', value: 'MANHWA' },
      { name: 'MANHUA', message: 'Manhua', value: 'MANHUA' },
      { name: 'MANFRA', message: 'Manfra', value: 'MANFRA' },
      { name: 'NATIONAL', message: 'National', value: 'NATIONAL' },
      { name: 'LIGHT_NOVEL', message: 'Light Novel', value: 'LIGHT_NOVEL' },
      { name: 'NOVEL', message: 'Novel', value: 'NOVEL' },
      { name: 'COMIC', message: 'Comic', value: 'COMIC' }
    ]
  },
  {
    type: 'select',
    name: 'demografy',
    message: "What is the serie's main demografy?",
    choices: [
      { name: 'SHOUNEN', message: 'Shounen', value: 'SHOUNEN' },
      { name: 'SHOUJO', message: 'Shoujo', value: 'SHOUJO' },
      { name: 'SEINEN', message: 'Seinen', value: 'SEINEN' },
      { name: 'JOSEI', message: 'Josei', value: 'JOSEI' },
      { name: 'SHOUJO_AI', message: 'Shoujo Ai', value: 'SHOUJO_AI' },
      { name: 'SHOUNEN_AI', message: 'Shounen Ai', value: 'SHOUNEN_AI' },
      { name: 'YAOI', message: 'Yaoi', value: 'YAOI' },
      { name: 'YURI', message: 'Yuri', value: 'YURI' },
      { name: 'HENTAI', message: 'Hentai', value: 'HENTAI' }
    ]
  },
  {
    type: 'multiselect',
    name: 'genresArray',
    message: "What are the serie's genres?",
    choices: [
      { name: 'ACTION', message: 'Action', value: 'ACTION' },
      { name: 'ADVENTURE', message: 'Adventure', value: 'ADVENTURE' },
      { name: 'CARS', message: 'Cars', value: 'CARS' },
      { name: 'COMEDY', message: 'Comedy', value: 'COMEDY' },
      { name: 'DEMENTIA', message: 'Dementia', value: 'DEMENTIA' },
      { name: 'DEMONS', message: 'Demons', value: 'DEMONS' },
      { name: 'DRAMA', message: 'Drama', value: 'DRAMA' },
      { name: 'ECCHI', message: 'Ecchi', value: 'ECCHI' },
      { name: 'FANTASY', message: 'Fantasy', value: 'FANTASY' },
      { name: 'GAME', message: 'Game', value: 'GAME' },
      {
        name: 'GENDER_BENDER',
        message: 'Gender Bender',
        value: 'GENDER_BENDER'
      },
      { name: 'HAREM', message: 'Harem', value: 'HAREM' },
      { name: 'HISTORICAL', message: 'Historical', value: 'HISTORICAL' },
      { name: 'HORROR', message: 'Horror', value: 'HORROR' },
      { name: 'MAGIC', message: 'Magic', value: 'MAGIC' },
      { name: 'MARTIAL_ARTS', message: 'Martial Arts', value: 'MARTIAL_ARTS' },
      { name: 'MECHA', message: 'Mecha', value: 'MECHA' },
      { name: 'MILITARY', message: 'Military', value: 'MILITARY' },
      { name: 'MUSIC', message: 'Music', value: 'MUSIC' },
      { name: 'MYSTERY', message: 'Mystery', value: 'MYSTERY' },
      { name: 'PARODY', message: 'Parody', value: 'PARODY' },
      { name: 'POLICE', message: 'Police', value: 'POLICE' },
      {
        name: 'PSYCHOLOGICAL',
        message: 'Psychological',
        value: 'PSYCHOLOGICAL'
      },
      { name: 'ROMANCE', message: 'Romance', value: 'ROMANCE' },
      { name: 'SAMURAI', message: 'Samurai', value: 'SAMURAI' },
      { name: 'SCHOOL', message: 'School', value: 'SCHOOL' },
      { name: 'SCI_FI', message: 'Sci-Fi', value: 'SCI_FI' },
      {
        name: 'SLICE_OF_LIFE',
        message: 'Slice of Life',
        value: 'SLICE_OF_LIFE'
      },
      { name: 'SPACE', message: 'Space', value: 'SPACE' },
      { name: 'SPORTS', message: 'Sports', value: 'SPORTS' },
      { name: 'SUPER_POWER', message: 'Super Power', value: 'SUPER_POWER' },
      { name: 'SUPERNATURAL', message: 'Supernatural', value: 'SUPERNATURAL' },
      { name: 'THRILLER', message: 'Thriller', value: 'THRILLER' },
      { name: 'VAMPIRE', message: 'Vampire', value: 'VAMPIRE' }
    ]
  }
]
