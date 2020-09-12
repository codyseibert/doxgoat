"use strict";

const Model = use("Model");

class Group extends Model {
  users() {
    return this.belongsToMany("App/Models/User", "groupId", "userId");
  }
}

module.exports = Group;
