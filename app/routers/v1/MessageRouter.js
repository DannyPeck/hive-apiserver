var query = require ('../../middleware/query')
  ;

const MESSAGE_QUERY_WHITELIST = ['sender', 'receiver'];

// MessageRouter
module.exports = exports = {
  '/messages' : {
    resource: {
      controller: 'MessageController',
      deny: ['getAll', 'delete']
    },
    get: {
      before: [ query.allow (MESSAGE_QUERY_WHITELIST) ],
      action: 'MessageController@getAll'
    }
  }
};
