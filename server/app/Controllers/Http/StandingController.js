'use strict'

const User = use('App/Models/User');
const Standing = use('App/Models/Standing');
const Event = use('App/Models/Event');
const StandingService = use('App/Services/StandingService');

class StandingController {
  async index ({ params }) {
    const { sport } =  params;
    const standingService = new StandingService();
    return await standingService.getStanding(sport, null)
  }

  async reset() {
    await Standing
      .query()
      .update({
        points: 0,
        streak: 0,
        wins: 0,
        losses: 0,
      });

    await Event
      .query()
      .update({
        processed: false,
      });
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

module.exports = StandingController
