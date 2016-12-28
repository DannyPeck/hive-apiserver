// MessageRouter
module.exports = exports = {
  '/messages' : {
    resource: {
      controller: 'MessageController',
      deny: ['delete']
    }
  }
};
