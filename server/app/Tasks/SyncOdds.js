"use strict";

const Task = use("Task");

const Event = use("App/Models/Event");

const moment = require("moment");
const request = require("request-promise");

async function syncOdds(sport) {
  console.log("sync odds");
  const oddEvents = await request({
    uri: `https://jsonodds.com/api/odds/${sport}`,
    headers: {
      "x-api-key": "a0ae6900-5e63-412f-9629-d4b1be4c2098"
    },
    method: "GET",
    json: true
  });

  console.log(
    oddEvents.map(e => {
      return `${e.AwayTeam} - ${e.HomeTeam}`;
    })
  );

  const odds = oddEvents.map(event => {
    const odds = event.Odds.find(odd => odd.OddType === "Game");
    return {
      homeTeam: event.HomeTeam,
      awayTeam: event.AwayTeam,
      matchTime: event.MatchTime,
      moneyHome: odds.MoneyLineHome,
      moneyAway: odds.MoneyLineAway
    };
  });

  const now = moment().format("YYYY-MM-DD");
  const events = await Event.query()
    .with("homeTeam")
    .with("awayTeam")
    .where("date", now)
    .where("sport", sport)
    .fetch();

  if (!events.rows.length) {
    console.log("could not find matching event for today");
    return;
  }

  await Promise.all(
    events.rows.map(async event => {
      const eJson = event.toJSON();
      const awayTeam = `${eJson.awayTeam.city} ${eJson.awayTeam.name}`;
      const homeTeam = `${eJson.homeTeam.city} ${eJson.homeTeam.name}`;

      const odd = odds.find(odd => {
        return awayTeam === odd.awayTeam && homeTeam === odd.homeTeam;
      });
      if (!odd) {
        console.log("no matching odd for this event: ", awayTeam, homeTeam);
        return;
      }
      if (odd.moneyHome) {
        event.homeOdds = odd.moneyHome;
      }
      if (odd.moneyAway) {
        event.awayOdds = odd.moneyAway;
      }
      await event.save();
    })
  );
}

class Sync extends Task {
  static get schedule() {
    return "0 */3 * * *";
  }

  async handle() {
    console.log("running Sync Odds script");

    await syncOdds("mlb");
    await syncOdds("nhl");
    await syncOdds("nba");
  }
}

module.exports = Sync;
