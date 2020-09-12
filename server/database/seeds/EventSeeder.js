'use strict'

/*
|--------------------------------------------------------------------------
| EventSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

const Factory = use('Factory')
const moment = require('moment');
require('moment-timezone');

const Event = use('App/Models/Event');
const events = [
  {
    sport: 'nhl',
    json: require('../../nhl_2018_events.json'),
  },
  {
    sport: 'nba',
    json: require('../../nba_2018_events.json'),
  },
  {
    sport: 'mlb',
    json: require('../../mlb_2017_events.json'),
  },
]

class EventSeeder {
  async run () {
    return;
    return Promise.all(events.map(({sport, json}) => {
      return Promise.all(json.fullgameschedule.gameentry.map((entry) => {
        const event = new Event();
        event.merge({
          id: entry.id,
          date: entry.date,
          time: entry.time,
          datetime: moment(`${entry.date} ${entry.time}`.toLowerCase(), 'YYYY-MM-DD h:mmA').tz('America/New_York').toISOString(),
          awayTeamId: entry.awayTeam.ID,
          awayOdds: 5,
          homeTeamId: entry.homeTeam.ID,
          homeOdds: 2.3,
          processed: false,
          awayScore: 5,
          homeScore: 2,
          sport,
        });
        return event.save();
      }));
    }));
  }
}

module.exports = EventSeeder
