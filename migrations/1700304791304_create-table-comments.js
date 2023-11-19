exports.up = pgm => {
  pgm.createTable('comments', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true
    },
    owner: {
      type: 'VARCHAR(50)',
      notNull: true,
      references: 'users(id)',
      onDelete: 'CASCADE'
    },
    thread_id: {
      type: 'VARCHAR(50)',
      notNull: true,
      references: 'threads(id)',
      onDelete: 'CASCADE'
    },
    content: {
      type: 'TEXT',
      notNull: true
    },
    date: {
      type: 'VARCHAR(50)'
    }
  })
}

exports.down = pgm => {
  pgm.dropTable('comments')
}
