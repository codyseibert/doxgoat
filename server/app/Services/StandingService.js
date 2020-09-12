'use strict'

const Standing = use('App/Models/Standing')

class StandingService {
  async getStanding (sport, groupId) {
    let query = Standing
      .query()
      .with('user')
      .where('sport', sport);

    if (groupId) {
      query = query.where('groupId', groupId)
    } else {
      query = query.whereNull('groupId')
    }

    const standings = (await query
      .fetch()
    )
      .rows
      .map(standing => standing.toJSON())
      .sort((a, b) => b.points - a.points)
      .map((standing, i) => ({
          ...standing,
          rank: i + 1,
          name: standing.user.username,
          winPercent: parseFloat(standing.wins) / parseFloat(standing.losses + standing.wins),
          userId: standing.user.id,
          user: undefined,
      }))
    return standings;
  }
}

module.exports = StandingService;
