'use strict'

const moment = require('moment');

const Selection = use('App/Models/Selection')
const Standing = use('App/Models/Standing')
const User = use('App/Models/User')
const Event = use('App/Models/Event')
const Point = use('App/Models/Point')
const Status = use('App/Models/Status')

class ScoreService {
  async updateStanding(standing, event, selection, sport) {
    const e = event.toJSON();
    const stand = standing.toJSON();
    if (event.homeOdds === null) {
      event.homeOdds = 100;
    }
    if (event.awayOdds === null) {
      event.awayOdds = 100;
    }
    let pointsToAward = 0;
    let winner = null;
    let loser = null;
    if (event.awayScore > event.homeScore) {
      winner = e.awayTeam.abbr;
      if (event.awayTeamId === selection.teamId) {
        if (event.awayOdds > 0) {
          pointsToAward = event.awayOdds / 100.0 + 1;
        } else {
          pointsToAward = 100.0 / Math.abs(event.awayOdds) + 1;
        }
        standing.wins++;
        standing.streak++;
        standing.hasWonSomething = true;
      } else {
        if (event.homeOdds > 0) {
          pointsToAward = (event.homeOdds / 100.0 + 1) * -0.5;
        } else {
          pointsToAward = (100.0 / Math.abs(event.homeOdds) + 1) * -1
        }
        standing.losses++;
        standing.streak--;
      }
    } else {
      winner = e.homeTeam.abbr;
      if (event.homeTeamId === selection.teamId) {
        if (event.homeOdds > 0) {
          pointsToAward = event.homeOdds / 100.0 + 1;
        } else {
          pointsToAward = 100.0 / Math.abs(event.homeOdds) + 1;
        }
        standing.wins++;
        standing.streak++;
        standing.hasWonSomething = true;
      } else {
        if (event.awayOdds > 0) {
          pointsToAward = (event.awayOdds / 100.0 + 1) * -0.5;
        } else {
          pointsToAward = (100.0 / Math.abs(event.awayOdds) + 1) * -1
        }
        standing.losses++;
        standing.streak--;
      }
    }
    standing.points += pointsToAward;
    if (stand.group === null) {
      // only keep track of points for the overall
      const point = new Point();
      point.merge({
        home: e.homeTeam.abbr,
        away: e.awayTeam.abbr,
        winner,
        sport,
        userId: standing.userId,
        points: pointsToAward,
        date: event.date,
      })
      await point.save();
    }
  }

  async processUser(event, user, sport) {
    let selections = await Selection.query()
      .where('userId', user.id)
      .where('eventId', event.id)
      .fetch();

    console.log(user.username);
    console.log('selections', selections.rows.length);

    if (!selections.rows.length) return;
    const selection = selections.rows[0];

    let standings = await Standing
      .query()
      .with('group')
      .where('userId', user.id)
      .where('sport', sport)
      .fetch();

    console.log('standings', standings.rows.length);

    if (!standings.rows.length) {
      return;
    }

    for (const standing of standings.rows) {
      const stand = standing.toJSON();
      if (
        stand.group === null ||
        moment(event.date).isBetween(
          moment(stand.group.startDate),
          moment(stand.group.endDate),
          'day',
          '[]'
        )
      ) {
        console.log('updating standing ', standing.id);
        await this.updateStanding(standing, event, selection, sport);
        await standing.save();
      }
    }
  }

  async processEvent(event, users, sport) {
    for (const user of users) {
      await this.processUser(event, user, sport);
    }
    event.processed = true;
    await event.save();
  }

  async processEvents(events, users, sport) {
    console.log('users to update', users.length);
    for (const event of events) {
      await this.processEvent(event, users, sport);
    }
  }

  async syncScores(sport) {
    console.log('syncing user scores for ', sport);

    const status = await Status.findOrCreate(
      {
        id: 1,
      },
    );
    status.lastUpdate = moment().format();
    await status.save();

    const events = await Event
      .query()
      .with('awayTeam')
      .with('homeTeam')
      .where('isCompleted', 1)
      .where('processed', 0)
      .where('sport', sport)
      .fetch();

    console.log('events', events.rows);

    events.rows.sort((a, b) => moment(a.datetime).diff(moment(b.datetime)));
    console.log('events to score', events.rows.length);

    const users = await User.all();
    await this.processEvents(events.rows, users.rows, sport);
  }
}

module.exports = ScoreService;
