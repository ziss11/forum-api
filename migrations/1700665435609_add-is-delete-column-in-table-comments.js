exports.up = pgm => {
  pgm.addColumn('comments', {
    is_delete: {
      type: 'BOOLEAN'
    }
  })
}

exports.down = pgm => {
  pgm.dropColumn('comments', 'is_delete')
}
