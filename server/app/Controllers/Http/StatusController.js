'use strict'

const Status = use('App/Models/Status');

class StatusController {
  async index () {
    const status = await Status.first();
    return status;
  }
}

module.exports = StatusController
