'use strict'

const Model = use('Model')

class Selection extends Model {
  event () {
    return this.hasOne('App/Models/Event', 'eventId', 'id')
  }

  team () {
    return this.hasOne('App/Models/Team', 'teamId', 'id')
  }

  user () {
    return this.hasOne('App/Models/User', 'userId', 'id')
  }
}

module.exports = Selection
