'use strict'

const Point = use('App/Models/Point');

class PointController {
  async index ({ params }) {
    const { userId, sport } = params;
    return await Point
      .query()
      .where('userId', userId)
      .where('sport', sport)
      .fetch();
  }
}

module.exports = PointController
