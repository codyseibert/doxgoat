"use strict";

const Task = use("Task");

const EventModel = use("App/Models/Event");
const TeamModel = use("App/Models/Team");

const moment = require("moment");
require("moment-timezone");

const request = require("request-promise");

const mySportsFeedHeaders = {
  Authorization: `Basic Z2FicmllbHNwZWN0ZXI6bmlja29sYXM=`
};

async function syncTeams(sport) {
  console.log("syncing teams");
  const teams = await request({
    uri: `https://api.mysportsfeeds.com/v1.2/pull/${sport}/latest/overall_team_standings.json`,
    headers: mySportsFeedHeaders,
    json: true
  });
  const entries = teams.overallteamstandings.teamstandingsentry;
  for (let i = 0; i < entries.length; i++) {
    const entry = entries[i];
    console.log(`(${i} / ${entries.length}) - syncing team ${entry.team.ID}`);
    let team = await TeamModel.find(entry.team.ID);
    if (!team) {
      team = new TeamModel();
    }
    team.merge({
      id: entry.team.ID,
      name: entry.team.Name,
      city: entry.team.City,
      abbr: entry.team.Abbreviation,
      sport,
      wins: (entry.stats.stats || entry.stats).Wins["#text"],
      losses: (entry.stats.stats || entry.stats).Losses["#text"]
    });
    await team.save();
  }
}

async function syncEvents(sport) {
  console.log("sync events for ", sport);
  const date = moment().format("YYYYMMDD");
  const dateDash = moment().format("YYYY-MM-DD");
  const schedule = await request({
    // uri: `https://api.mysportsfeeds.com/v1.2/pull/nba/latest/daily_game_schedule.json?fordate=20180614`
    uri: `https://api.mysportsfeeds.com/v1.2/pull/${sport}/latest/daily_game_schedule.json?fordate=${date}`,
    headers: mySportsFeedHeaders,
    json: true
  });
  const entries = schedule.dailygameschedule.gameentry || [];
  for (let i = 0; i < entries.length; i++) {
    const entry = entries[i];
    console.log(`(${i + 1} / ${entries.length}) - syncing event ${entry.id}`);
    let event = await EventModel.find(entry.id);
    if (!event) {
      event = new EventModel();
    }
    event.merge({
      id: entry.id,
      date: dateDash,
      time: entry.time,
      datetime: moment(
        `${entry.date} ${entry.time}`.toLowerCase(),
        "YYYY-MM-DD h:mmA"
      )
        .tz("America/New_York")
        .format(),
      awayTeamId: entry.awayTeam.ID,
      homeTeamId: entry.homeTeam.ID,
      sport
    });
    await event.save();
  }
}

class Sync extends Task {
  static get schedule() {
    return "0 * * * *";
  }

  async handle() {
    console.log("running Sync script");
    await syncTeams("mlb");
    await syncTeams("nhl");
    await syncTeams("nba");

    await syncEvents("mlb");
    await syncEvents("nhl");
    await syncEvents("nba");
  }
}

module.exports = Sync;
