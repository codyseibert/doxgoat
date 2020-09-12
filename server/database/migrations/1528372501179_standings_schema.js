'use strict'

const Schema = use('Schema')

class StandingsSchema extends Schema {
  up () {
    this.create('standings', (table) => {
      table.increments()
      table.integer('userId').unsigned().references('id').inTable('users')
      table.integer('groupId').unsigned().references('id').inTable('groups')
      table.integer('wins');
      table.integer('losses');
      table.float('points');
      table.integer('streak').defaultTo(0);
      table.string('sport');
      table.boolean('hasWonSomething');
      table.timestamps()
    })
  }

  down () {
    this.drop('standings')
  }
}

module.exports = StandingsSchema
