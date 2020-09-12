"use strict";

const User = use("App/Models/User");
const Group = use("App/Models/Group");
const Standing = use("App/Models/Standing");
const Team = use("App/Models/Team");
const JoinCount = use("App/Models/JoinCount");
const { validate } = use("Validator");

class UserController {
  async login({ request, auth }) {
    // disabling for now
    // return response.status(500).json({
    //   messsage: "disabled"
    // });

    const { email, password } = request.all();
    const token = await auth.attempt(email, password);
    return token;
  }

  async register({ request, response }) {
    // disabling for now
    // return response.status(500).json({
    //   messsage: "disabled"
    // });

    const rules = {
      email: "required|email",
      username: "required",
      password: "required"
    };

    const validation = await validate(request.all(), rules);

    if (validation.fails()) {
      return response.status(400).json({
        messsage: validation.messages()
      });
    }

    const { email, password, username } = request.all();
    const user = await User.create({
      email,
      password,
      loginSource: "email",
      username: username || email
    });

    const addStanding = async sport => {
      const newStanding = {
        userId: user.id,
        groupId: null,
        wins: 0,
        losses: 0,
        points: 0,
        sport: sport,
        streak: 0
      };

      let standing = new Standing();
      standing.merge(newStanding);
      await standing.save();
    };
    
    await addStanding('mlb');
    await addStanding('nhl');
    await addStanding('nba');
    
    return this.login(...arguments);
  }

  async groups({ params }) {
    const { sport, userId: id } = params;
    const user = await User.find(id);
    const groups = await user
      .groups()
      .where("sport", sport)
      .fetch();
    return groups.rows.map(group => ({
      ...group.toJSON(),
      password: undefined
    }));
  }

  async leaveGroup({ params, auth, response }) {
    const { userId, groupId } = params;
    const user = await User.find(userId);
    await user.groups().detach([groupId]);
    await Standing.query()
      .where("userId", userId)
      .where("groupId", groupId)
      .delete();
  }

  async joinGroup({ request, auth, response }) {
    const { userId, groupId, password } = request.all();
    const user = await User.find(userId);
    const group = await Group.find(groupId);

    const usersInGroup = await group.users().fetch();
    if (usersInGroup.rows.find(u => u.id === userId)) {
      return response.status(404).json({
        message: "already part of group"
      });
    }

    if (group.groupStatus === "private" && group.password !== password) {
      return response.status(403).json({
        message: "invalid group password"
      });
    }

    const count = await group.users().count("* as total");
    const total = count[0].total;

    if (group.maxGroupSize && total + 1 > group.maxGroupSize) {
      return response.status(400).json({
        message: "group full"
      });
    }

    const joinCounts = await JoinCount.query()
      .where("userId", userId)
      .where("groupId", groupId)
      .fetch();
    let joinCount;
    if (joinCounts.rows.length) {
      joinCount = joinCounts.rows[0];
    } else {
      joinCount = new JoinCount();
      joinCount.merge({
        userId,
        groupId,
        count: 0
      });
    }

    if (joinCount.count >= 3) {
      return response.status(400).json({
        message: "you have re-joined this group too many times"
      });
    }

    joinCount.count++;
    await joinCount.save();

    const standing = new Standing();
    standing.merge({
      userId,
      groupId,
      wins: 0,
      losses: 0,
      points: 0,
      sport: group.sport,
      streak: 0
    });
    await standing.save();
    return await user.groups().attach([groupId]);
  }

  async index() {
    return await User.all();
  }

  async activity({ params }) {
    const { userId: id } = params;
    const user = await User.findOrFail(id);
    user.lastActive = new Date().toISOString();
    return await user.save();
  }

  async selections({ params }) {
    const { userId: id } = params;
    const user = await User.findOrFail(id);
    return await user.selections().fetch();
  }

  async profile({ params }) {
    const { sport, userId: id } = params;
    const user = await User.findOrFail(id);
    const teams = await Team.query()
      .where("sport", sport)
      .fetch();
    const groups = await user
      .groups()
      .where("sport", sport)
      .fetch();
    const standings = await user
      .standings()
      .where("sport", sport)
      .whereNull("groupId")
      .fetch();
    const selections = await user
      .selections()
      .with("event")
      .with("team")
      .fetch();

    const overall = await Standing.query()
      .where("sport", sport)
      .whereNull("groupId")
      .fetch();

    const position =
      overall.rows
        .map(standing => standing.toJSON())
        .sort((a, b) => b.points - a.points)
        .findIndex(standing => standing.userId === parseInt(id)) + 1;

    let wins = 0;
    let losses = 0;
    if (standings.rows.length) {
      wins = standings.rows[0].wins;
      losses = standings.rows[0].losses;
    }

    const teamCounts = {};
    teams.rows.forEach(team => {
      teamCounts[team.name] = 0;
    });
    selections.rows
      .map(selection => selection.toJSON())
      .filter(selection => selection.event.sport === sport)
      .forEach(selection => {
        teamCounts[selection.team.name]++;
      });
    const counts = [];
    for (let key of Object.keys(teamCounts)) {
      const val = teamCounts[key];
      counts.push({
        name: key,
        value: val
      });
    }
    counts.sort((a, b) => b.value - a.value);

    const mostPickedTeam = counts.length ? counts[0].name : "N/A";
    const leastPickedTeam = counts.length
      ? counts[counts.length - 1].name
      : "N/A";

    let winLossPercent = parseFloat(wins) / parseFloat(losses + wins);
    if (isNaN(winLossPercent)) {
      winLossPercent = 100;
    } else {
      winLossPercent *= 100;
    }
    winLossPercent = Math.round(winLossPercent);

    return {
      name: user.username,
      lastActive: user.lastActive,
      totalGames: selections.rows.filter(
        selection => selection.toJSON().event.sport === sport
      ).length,
      winLossPercent: winLossPercent,
      mostPickedTeam: mostPickedTeam,
      leastPickedTeam: leastPickedTeam,
      position,
      groups
    };
  }
}

module.exports = UserController;
