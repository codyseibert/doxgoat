'use strict'

const Group = use('App/Models/Group');
const Standing = use('App/Models/Standing');
const StandingService = use('App/Services/StandingService');

class GroupController {
  async index ({ params }) {
    const { sport } = params;
    const groups = await Group
      .query()
      .withCount('users')
      .where('sport', sport)
      .fetch();
    return groups.rows.map(group => ({
      ...group.toJSON(),
      password: undefined,
    }))
      .filter(group => group.__meta__.users_count > 0);
  }

  async show ({ params }) {
    const { groupId } = params;
    return await Group
      .query()
      .where('id', groupId)
      .withCount('users')
      .first();
  }

  async create ({ request, response }) {
    const body = request.all();
    const groups = await Group
      .query()
      .where('name', body.name)
      .where('sport', body.sport)
      .fetch();
    if (groups.rows.length) {
      return response.status(400).json({
        message: 'group name already exists',
      });
    }
    const group = new Group();
    group.merge(request.all());
    await group.save();
    return group;
  }

  async standings ({ params }) {
    const {sport, groupId} = params;
    const standingService = new StandingService();
    return await standingService.getStanding(sport, groupId);
  }

  async store () {
  }

  async edit () {
  }

  async update () {
  }

  async destroy () {
  }

  async getUsers({ params }) {
    const { groupId: id } = params;
    const group = await Group.find(id);
    return await group.users().fetch();
  }
}

module.exports = GroupController
