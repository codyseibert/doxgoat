'use strict'

const Schema = use('Schema')

class SportsSchema extends Schema {
  up () {
    this.create('sports', (table) => {
      table.increments()
      table.timestamps()
    })
  }

  down () {
    this.drop('sports')
  }
}

module.exports = SportsSchema
