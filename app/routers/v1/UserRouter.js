// UserRouter
module.exports = exports = {
  '/users' : {
    '/profile': {
      get: { action: 'UserController@profile' }
    },
    resource: {
      controller: 'UserController',
      deny: ['create', 'update', 'delete']
    }
  }
};
