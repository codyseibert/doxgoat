'use strict'

const Schema = use('Schema')

class SelectionSchema extends Schema {
  up () {
    this.create('selections', (table) => {
      table.increments()
      table.integer('userId').unsigned().references('id').inTable('users')
      table.integer('eventId').unsigned().references('id').inTable('events')
      table.integer('teamId').unsigned().references('id').inTable('teams')
      table.timestamps()
    })
  }

  down () {
    this.drop('selections')
  }
}

module.exports = SelectionSchema
