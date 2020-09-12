'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URL's and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.0/routing
|
*/

const Route = use('Route')

Route.group(() => {
  Route.post('/auth/register', 'UserController.register');
  Route.post('/auth/login', 'UserController.login');
  Route.get('/users', 'UserController.index');
  Route.get('/sports/:sport/users/:userId', 'UserController.profile');
  Route.get('/sports/:sport/users/:userId/groups', 'UserController.groups');
  Route.get('/sports/:sport/users/:userId/points', 'PointController.index');
  Route.get('/users/:userId/selections', 'UserController.selections');
  Route.post('/users/:userId/activity', 'UserController.activity');

  Route.get('/events/:sport', 'EventController.index');

  Route.get('/teams', 'TeamController.index');
  Route.post('/groups', 'GroupController.create');
  Route.get('/sports/:sport/groups', 'GroupController.index');
  Route.get('/groups/:groupId', 'GroupController.show');
  Route.get('/groups/:groupId/users', 'GroupController.getUsers');

  Route.get('/sports/:sport/groups/:groupId/standings', 'GroupController.standings');

  Route.get('/sports/:sport/standings/overall', 'StandingController.index');

  Route.post('/groups_users', 'UserController.joinGroup');
  Route.delete('/groups_users/:groupId/users/:userId', 'UserController.leaveGroup');

  Route.get('/selections', 'SelectionController.index');
  Route.post('/selections', 'SelectionController.create');
  Route.delete('/selections/:selectionId', 'SelectionController.destroy');

  Route.get('/status', 'StatusController.index');

  Route.get('/login/:provider', 'LoginController.redirect');
  Route.get('/:provider/callback', 'LoginController.callback');

  Route.get('/reset', 'StandingController.reset');
}).prefix('api');
