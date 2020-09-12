'use strict'

const Schema = use('Schema')

class EventsSchema extends Schema {
  up () {
    this.create('events', (table) => {
      table.integer('id').unsigned().notNullable().unique()
      table.string('date')
      table.string('time')
      table.integer('homeTeamId').unsigned().references('id').inTable('teams')
      table.integer('awayTeamId').unsigned().references('id').inTable('teams')
      table.integer('awayScore')
      table.float('awayOdds')
      table.integer('homeScore')
      table.string('sport')
      table.float('homeOdds')
      table.string('datetime', 255)
      table.boolean('processed').defaultTo(false);
      table.boolean('isCompleted').defaultTo(false);
      table.boolean('isInProgress').defaultTo(false);
      table.timestamps()
    })
  }

  down () {
    this.drop('events')
  }
}

module.exports = EventsSchema
