"use strict";

const Schema = use("Schema");

class UserDropUniqueEmail extends Schema {
  up() {
    this.alter("users", table => {
      table.dropUnique("email");
      table.unique(["email", "loginSource"]);
    });
  }

  down() {
    this.alter("users", table => {
      table.unique("email");
    });
  }
}

module.exports = UserDropUniqueEmail;
