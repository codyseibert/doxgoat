'use strict'

const Schema = use('Schema')

class GroupUserSchema extends Schema {
  up () {
    this.create('group_user', (table) => {
      table.increments()
      table.integer('userId').unsigned().references('id').inTable('users')
      table.integer('groupId').unsigned().references('id').inTable('groups')
      table.timestamps()
    })
  }

  down () {
    this.drop('group_user')
  }
}

module.exports = GroupUserSchema
