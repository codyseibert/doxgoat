'use strict'

const Model = use('Model')

class Standing extends Model {
  user () {
    return this.hasOne('App/Models/User', 'userId', 'id')
  }

  group () {
    return this.hasOne('App/Models/Group', 'groupId', 'id')
  }
}

module.exports = Standing
