exports.up = pgm => {
  pgm.addColumn('replies', {
    thread_id: {
      type: 'VARCHAR(50)',
      references: 'threads(id)',
      onDelete: 'CASCADE'
    }
  })
}

exports.down = pgm => {
  pgm.dropColumn('replies', 'thread_id')
}
