'use strict';

var blueprint = require ('@onehilltech/blueprint')
  , mongodb = require ('@onehilltech/blueprint-mongodb')
  , ResourceController = mongodb.ResourceController
  ;

var Message = require ('../models/Message')
  , User    = require ('../models/User')
  ;

function MessageController () {
  ResourceController.call (this, {name: 'message', model: Message});
}

MessageController.prototype.create = function () {
  var opts = {
    on: {
      preCreate: function (req, doc, callback) {
        var token = req.headers.authorization.split(' ')[1];

        User.findOne({token: token}, function (err, user) {
          /* istanbul ignore if */
          if (err) {
            return callback(err);
          }

          doc.org_id = user.org_id;
          doc.sender = user.username;
          return callback(null, doc);
        });
      }
    }
  };

  return mongodb.ResourceController.prototype.create.call (this, opts);
};

MessageController.prototype.getAll = function () {
  var opts = {
    on: {
      authorize: function (req, callback) {
        var role = req.user.role;

        if (role != 'admin') {
          var whitelist = ['sender', 'receiver'];
          var queries = req.query;

          _.forEach(queries, function (query) {
            if (_.includes(whitelist, query)) {
              return callback ('unauthorized query parameter');
            }
          });
        }

        return callback ();
      }
    }
  };

  return mongodb.ResourceController.prototype.getAll.call (this, opts);
};

blueprint.controller (MessageController, ResourceController);

module.exports = MessageController;