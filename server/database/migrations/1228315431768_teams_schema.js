'use strict'

const Schema = use('Schema')

class TeamsSchema extends Schema {
  up () {
    this.create('teams', (table) => {
      table.integer('id').unsigned().unique()
      table.string('name', 255)
      table.string('abbr', 255)
      table.string('city', 255)
      table.string('sport')
      table.string('wins')
      table.string('losses')
      table.timestamps()
    })
  }

  down () {
    this.drop('teams')
  }
}

module.exports = TeamsSchema
