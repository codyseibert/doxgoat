'use strict'

/*
|--------------------------------------------------------------------------
| TeamSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

const Factory = use('Factory')

const Team = use('App/Models/Team');
const teams = [
  {
    json: require('../../nhl_2018_teams.json'),
  },
  {
    json: require('../../nba_2018_teams.json'),
  },
  {
    json: require('../../mlb_2017_teams.json'),
  },
]

class TeamSeeder {
  async run () {
    return;
    return Promise.all(teams.map(({json}) => {    
      return Promise.all(json.overallteamstandings.teamstandingsentry.map((entry) => {
        const team = new Team();
        team.merge({
          id: entry.team.ID,
          name: entry.team.Name,
          city: entry.team.City,
          abbr: entry.team.Abbreviation,
          wins: (entry.stats.stats || entry.stats).Wins['#text'],
          losses: (entry.stats.stats || entry.stats).Losses['#text']
        });
        return team.save();
      }));
    }));
  }
}

module.exports = TeamSeeder
