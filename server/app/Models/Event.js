'use strict'

const Model = use('Model')

class Event extends Model {
  homeTeam() {
    return this.hasOne('App/Models/Team', 'homeTeamId', 'id')
  }

  awayTeam () {
    return this.hasOne('App/Models/Team', 'awayTeamId', 'id')
  }
}

module.exports = Event
