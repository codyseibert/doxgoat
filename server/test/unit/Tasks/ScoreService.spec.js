'use strict'

const { ioc } = use('@adonisjs/fold')
const ScoreServiceSuit = use('Test/Suite')('ScoreService')
const { test, before, beforeEach, after, afterEach } = ScoreServiceSuit;

function modelMockBuilder(data) {
  return {
    query() { return this; },
    with() { return this; },
    where() { return this; },
    fetch() { return Promise.resolve(data); },
    all() { return Promise.resolve(data); },
  }
}

let savedStanding;
let savedEvent;
let scoreService;
let selectedTeam;
let awayScore;
let homeScore;
let event;
let selection = {
  id: 1,
  teamId: 10,
};
let standing = {
  id: 1,
  points: 0,
  wins: 0,
  losses: 0,
  streak: 0,
  group: {
    startDate: '2017-06-10',
    endDate: '2050-06-14',
  },
  save() {
    savedStanding = this;
  }
}

beforeEach(async () => {
  savedStanding = null;
  savedEvent = null;
  standing.points = 0;
  standing.wins = 0;
  standing.losses = 0;
  standing.streak = 0;

  ioc.fake('App/Models/User', () => {
    return modelMockBuilder({
      rows: [
        {
          id: 5,
        }
      ]
    });
  });

  ioc.fake('App/Models/Selection', () => {
    return modelMockBuilder({
      rows: [selection],
    });
  });

  ioc.fake('App/Models/Event', () => {
    event = {
      id: 1,
      processed: false,
      awayScore: 5,
      homeScore: 0,
      awayTeamId: 10,
      homeTeamId: 1,
      awayOdds: 108,
      homeOdds: -125,
      save() {
        savedEvent = this;
      }
    };
    return modelMockBuilder({
      rows: [event],
    });
  });

  ioc.fake('App/Models/Standing', () => {
    return modelMockBuilder({
      rows: [standing],
    });
  });

  const ScoreService = use('App/Services/ScoreService')
  scoreService = new ScoreService();
});

afterEach(async () => {
  ioc.restore('App/Models/Event')
  ioc.restore('App/Models/User')
  ioc.restore('App/Models/Standing')
  ioc.restore('App/Models/Selection')
});

test('syncScores should set the event to processed after finishing', async ({ assert }) => {
  await scoreService.syncScores('mlb');
  assert.equal(savedEvent.processed, true);
})

test('syncScores - away team won, user picked away team', async ({ assert }) => {
  selection.teamId = 10;
  event.awayScore = 5;
  event.homeScore = 0;
  await scoreService.syncScores('mlb');
  assert.deepInclude(savedStanding, {
    wins: 1,
    losses: 0,
    points: 2.08,
    streak: 1,
  });
})

test('syncScores - away team one, user picked home team', async ({ assert }) => {
  selection.teamId = 1;
  event.awayScore = 5;
  event.homeScore = 0;
  await scoreService.syncScores('mlb');
  assert.deepInclude(savedStanding, {
    wins: 0,
    losses: 1,
    points: -1.8,
    streak: -1,
  });
})

test('syncScores - home team won, player picked away team', async ({ assert }) => {
  selection.teamId = 10;
  event.awayScore = 0;
  event.homeScore = 5;
  await scoreService.syncScores('mlb');
  assert.deepInclude(savedStanding, {
    wins: 0,
    losses: 1,
    points: -1.04,
    streak: -1,
  });
})

test('syncScores - home team won, player picked home team', async ({ assert }) => {
  selection.teamId = 1;
  event.awayScore = 0;
  event.homeScore = 5;
  await scoreService.syncScores('mlb');
  assert.deepInclude(savedStanding, {
    wins: 1,
    losses: 0,
    points: 1.8,
    streak: 1,
  });
})