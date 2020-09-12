'use strict'

const Schema = use('Schema')

class PointsSchema extends Schema {
  up () {
    this.create('points', (table) => {
      table.increments()
      table.integer('userId').unsigned().references('id').inTable('users')
      table.string('sport');
      table.string('home');
      table.string('away');
      table.string('winner');
      table.float('points');
      table.string('date')
      table.timestamps()
    })
  }

  down () {
    this.drop('points')
  }
}

module.exports = PointsSchema
