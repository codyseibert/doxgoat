'use strict'

const Schema = use('Schema')

class JoinCountSchema extends Schema {
  up () {
    this.create('join_counts', (table) => {
      table.increments()
      table.integer('userId').unsigned().references('id').inTable('users')
      table.integer('groupId').unsigned().references('id').inTable('groups')
      table.integer('count');
      table.timestamps()
    })
  }

  down () {
    this.drop('join_counts')
  }
}

module.exports = JoinCountSchema
