'use strict'

const User = use('App/Models/User');
const Event = use('App/Models/Event');
const Selection = use('App/Models/Selection');
const moment = require('moment');

class SelectionController {
  async index () {
    return await Selection.all();
  }

  async create ({ request, response }) {
    const { userId, eventId, teamId } = request.all();
    const user = await User.find(userId);
    const event = await Event.find(eventId);
    // if (moment().isAfter(moment(event.datetime))) {
    //   return response.status(400).json({
    //     message: 'this event has already started'
    //   });
    // }
    let selections = await Selection.query()
      .where('userId', userId)
      .andWhere('eventId', eventId)
      .fetch();
    let selection;
    if (selections.rows.length) {
      selection = selections.rows[0];
    } else {
      selection = new Selection();
      selection.merge({
        userId,
        eventId,
      })
    }
    selection.merge({
      teamId,
    });
    await selection.save();
    return selection;
  }

  async store () {
  }

  async show () {
  }

  async edit () {
  }

  async update () {
  }

  async destroy ({ params }) {
    const { selectionId: id } = params;
    const selection = await Selection.findOrFail(parseInt(id, 10));
    await selection.delete();
  }
}

module.exports = SelectionController
