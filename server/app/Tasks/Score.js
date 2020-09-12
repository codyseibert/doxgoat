'use strict'

const Task = use('Task')

const ScoreService = use('App/Services/ScoreService');

class Score extends Task {
  static get schedule () {
    return '*/5 * * * *'
  }

  async handle () {
    const service = new ScoreService();
    await service.syncScores('mlb');
    await service.syncScores('nhl');
    await service.syncScores('nba');
  }
}

module.exports = Score
