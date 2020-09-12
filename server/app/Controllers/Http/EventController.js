"use strict";

// gabrielspecter
// nickolas

const moment = require("moment");

const Event = use("App/Models/Event");

class EventController {
  async index({ params }) {
    const { sport } = params;
    let previousEvents = { rows: [] };

    if (
      moment().isBefore(
        moment()
          .startOf("day")
          .add(4, "hour")
      )
    ) {
      previousEvents = await Event.query()
        .with("homeTeam")
        .with("awayTeam")
        .where("sport", sport)
        .where(
          "date",
          moment()
            .subtract(1, "day")
            .format("YYYY-MM-DD")
        )
        .fetch();
    }

    const currentEvents = await Event.query()
      .with("homeTeam")
      .with("awayTeam")
      .where("sport", sport)
      .where("date", moment().format("YYYY-MM-DD"))
      .fetch();

    return [...previousEvents.rows, ...currentEvents.rows];
  }

  async create() {}

  async store() {}

  async show() {}

  async edit() {}

  async update() {}

  async destroy() {}
}

module.exports = EventController;
