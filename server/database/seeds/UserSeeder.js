'use strict'

/*
|--------------------------------------------------------------------------
| UserSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

const Factory = use('Factory')

const User = use('App/Models/User');

class UserSeeder {
  async run () {
    return;
    const user = new User();
    user.merge({
      email: 'cseibert113@gmail.com',
      username: 'cseibert113@gmail.com',
      password: '123456',
    });
    // return await user.save();
  }
}

module.exports = UserSeeder
