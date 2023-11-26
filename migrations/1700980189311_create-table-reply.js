exports.up = pgm => {
  pgm.createTable('replies', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true
    },
    owner: {
      type: 'VARCHAR(50)',
      notNull: true,
      reference: 'users(id)',
      onDelete: 'CASCADE'
    },
    comment_id: {
      type: 'VARCHAR(50)',
      notNull: true,
      reference: 'comments(id)',
      onDelete: 'CASCADE'
    },
    content: {
      type: 'TEXT',
      notNull: true
    },
    date: {
      type: 'VARCHAR(50)'
    },
    is_delete: {
      type: 'BOOLEAN'
    }
  })
}

exports.down = pgm => {
  pgm.dropTable('replies')
}
