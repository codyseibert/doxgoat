"use strict";

const User = use("App/Models/User");
const Standing = use("App/Models/Standing");

class LoginController {
  async redirect({ ally, params }) {
    await ally.driver(params.provider).redirect();
  }

  async callback({ ally, auth, response, params }) {
    try {
      const externalUser = await ally.driver(params.provider).getUser();

      // user details to be saved
      const userDetails = {
        email: externalUser.getEmail(),
        username: externalUser.getNickname(),
        loginSource: params.provider
      };

      // search for existing user
      const whereClause = {
        email: externalUser.getEmail(),
        loginSource: params.provider
      };

      const user = await User.findOrCreate(whereClause, userDetails);

      const standings = await Standing.query()
        .where("userId", user.id)
        .whereNull("groupId", null)
        .fetch();

      if (!standings.rows.length) {
        // TODO: This seems hacky
        const sports = ["nba", "mlb", "nhl"];
        for (let i = 0; i < sports.length; i++) {
          const sport = sports[i];
          const standing = new Standing();
          standing.merge({
            userId: user.id,
            groupId: null,
            wins: 0,
            losses: 0,
            points: 0,
            streak: 0,
            sport
          });
          await standing.save();
        }
      }

      const data = await auth.generate(user);

      return response.redirect(`/#/callback/${data.token}`);
    } catch (error) {
      return response.redirect(`/#/errors`);
    }
  }
}

module.exports = LoginController;
