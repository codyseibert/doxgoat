'use strict'

const Task = use('Task')

const Selection = use('App/Models/Selection')
const Standing = use('App/Models/Standing')
const User = use('App/Models/User')
const Event = use('App/Models/Event')

const request = require('request-promise');
const moment = require('moment');

const mySportsFeedHeaders = {
  Authorization: `Basic Z2FicmllbHNwZWN0ZXI6bmlja29sYXM=`
}

async function syncScores(sport, date) {
  console.log('syncing scores for ', sport);
  const score = await request({
    uri: `https://api.mysportsfeeds.com/v1.2/pull/${sport}/latest/scoreboard.json?fordate=${date.format('YYYYMMDD')}`,
    headers: mySportsFeedHeaders,
    json: true,
  });
  const games = score.scoreboard.gameScore || [];
  for (let i = 0; i < games.length; i++) {
    const game = games[i];
    const event = await Event.find(game.game.ID);
    if (!event) {
      return;
    }
    event.merge({
      awayScore: game.awayScore,
      homeScore: game.homeScore,
      isCompleted: game.isCompleted === 'true' ? 1 : 0,
      isInProgress: game.isInProgress === 'true' ? 1 : 0,
      currentSection: game.currentPeriod || game.currentInning || game.currentQuarter,
    });
    await event.save();
  }
}

class EventScore extends Task {
  static get schedule () {
    return '*/1 * * * *'
  }

  async handle () {
    await syncScores('mlb', moment());
    await syncScores('mlb', moment().subtract(1, 'day'));
    await syncScores('nhl', moment());
    await syncScores('nhl', moment().subtract(1, 'day'));
    await syncScores('nba', moment());
    await syncScores('nba', moment().subtract(1, 'day'));
  }
}

module.exports = EventScore
