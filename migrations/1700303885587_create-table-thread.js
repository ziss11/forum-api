exports.up = pgm => {
  pgm.createTable('threads', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true
    },
    owner: {
      type: 'VARCHAR(50)',
      notNull: true,
      references: 'users(id)'
    },
    title: {
      type: 'VARCHAR(50)',
      notNull: true
    },
    body: {
      type: 'TEXT',
      notNull: true
    },
    date: {
      type: 'VARCHAR(50)'
    }
  })
}

exports.down = pgm => {
  pgm.dropTable('threads')
}
