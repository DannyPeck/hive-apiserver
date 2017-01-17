'use strict';

var blueprint = require ('@onehilltech/blueprint')
  , mongodb = require ('@onehilltech/blueprint-mongodb')
  , ResourceController = mongodb.ResourceController
  , _ = require ('lodash')
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
        doc.org_id = req.user.org_id;
        doc.sender = req.user.username;

        return callback(null, doc);
      }
    }
  };

  return mongodb.ResourceController.prototype.create.call (this, opts);
};

blueprint.controller (MessageController, ResourceController);

module.exports = MessageController;