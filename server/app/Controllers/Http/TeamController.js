'use strict'

const Team = use('App/Models/Team');

class TeamController {
  async index () {
    return await Team.all();
  }

  async create () {
  }

  async store () {
  }

  async show () {
  }

  async edit () {
  }

  async update () {
  }

  async destroy () {
  }
}

module.exports = TeamController
