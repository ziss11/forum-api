// istanbul ignore file
const { createContainer } = require('instances-container')

const { nanoid } = require('nanoid')
const bcrypt = require('bcrypt')
const pool = require('../Infrastructures/databases/postgres/pool')

const UserRepository = require('../Domains/users/UserRepository')
const UserRepositoryPostgres = require('../Infrastructures/repository/UserRepositoryPostgres')
const PasswordHash = require('../Applications/security/PasswordHash')
const BcryptPasswordHash = require('./security/BcryptPasswordHash')
const AddUserUseCase = require('../Applications/use_case/AddUserUseCase')

const container = createContainer()

container.register([
  {
    key: UserRepository.name,
    Class: UserRepositoryPostgres,
    parameter: {
      dependencies: [
        {
          concrete: pool
        },
        {
          concrete: nanoid
        }
      ]
    }
  },
  {
    key: PasswordHash.name,
    Class: BcryptPasswordHash,
    parameter: {
      dependencies: [
        {
          concrete: bcrypt
        }
      ]
    }
  }
])

container.register([
  {
    key: AddUserUseCase.name,
    Class: AddUserUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'userRepository',
          internal: UserRepository.name
        },
        {
          name: 'passwordHash',
          internal: PasswordHash.name
        }
      ]
    }
  }
])

module.exports = container
