/* istanbul ignore file */

const pool = require('../src/Infrastructures/databases/postgres/pool')

const AuthenticationsTableTestHelper = {
  async addAuth (token) {
    const query = {
      text: 'INSERT INTO authentications VALUES($1)',
      values: [token]
    }

    await pool.query(query)
  },

  async findToken (token) {
    const query = {
      text: 'SELECT * FROM authentications WHERE token=$1',
      values: [token]
    }

    const result = await pool.query(query)
    return result.rows
  },

  async cleanTable () {
    await pool.query('TRUNCATE TABLE authentications')
  }
}

module.exports = AuthenticationsTableTestHelper
