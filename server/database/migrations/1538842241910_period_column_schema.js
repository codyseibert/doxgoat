'use strict'

const Schema = use('Schema')

class PeriodColumnSchema extends Schema {
  up () {
    this.alter('events', (table) => {
      table.string('currentSection')
    })
  }

  down () {
    this.alter('events', (table) => {
      table.dropColumn('currentSection')
    })
  }
}

module.exports = PeriodColumnSchema
