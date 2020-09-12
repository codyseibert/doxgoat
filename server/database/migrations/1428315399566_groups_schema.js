'use strict'

const Schema = use('Schema')

class GroupsSchema extends Schema {
  up () {
    this.create('groups', (table) => {
      table.increments()
      table.string('name')
      table.string('startDate')
      table.string('endDate')
      table.integer('maxGroupSize')
      table.string('sport')
      table.integer('groupSize').defaultTo(0)
      table.string('groupStatus')
      table.string('password')
      table.timestamps()
    })
  }

  down () {
    this.drop('groups')
  }
}

module.exports = GroupsSchema
