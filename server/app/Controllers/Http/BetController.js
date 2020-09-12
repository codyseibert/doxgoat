'use strict'

const Bet = use('App/Models/Bet');
const User = use('App/Models/User');

class BetController {
  async index () {
  }

  async create ({ request }) {
    const { userId, eventId, teamId } = request.all();
    const user = await User.find(userId);
    const bet = new Bet();
    bet.merge({
      userId,
      eventId,
      teamId,
    });
    return await bet.save();
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

module.exports = BetController
