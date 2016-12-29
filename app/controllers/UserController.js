var blueprint = require ('@onehilltech/blueprint')
  , mongodb = require ('@onehilltech/blueprint-mongodb')
  , ResourceController = mongodb.ResourceController
  , async = require ('async')
  ;

var User = require ('../models/User')
  ;

// this code effectively subclasses ResourceController with the specific information below
function UserController () {
  ResourceController.call (this, {name: 'user', model: User});
}

UserController.prototype.create = function ()
{
  var opts = {
    on: {
      preCreate: function (req, doc, cb) {
        async.waterfall ([
          function (callback) {
            var token = req.headers.authorization.split(' ')[1];

            User.findOne ({token: token}, function (err, admin) {
              if (err) { return callback (err); }

              doc.org_id = admin.org_id;
              return callback (null, doc);
            });
          },

          function (doc, callback) {
            User.findOne ({email: doc.email}, function (err, user) {
              if (err) { return callback (err); }

              if (user) {
                return callback ('email already taken', null);
              } else {
                return callback (null, doc);
              }
            });
          },

          function (doc, callback) {
            User.findOne ({username: doc.username, org_id: doc.org_id}, function (err, user) {
              if (err) { return callback (err); }

              if (user) {
                return callback ('user already exists', null);
              } else {
                return callback (null, doc);
              }
            });
          }
        ], cb);
      }
    }
  };

  return mongodb.ResourceController.prototype.create.call (this, opts);
};

UserController.prototype.profile = function () {
  return function (req, res) {
    var token = req.headers.authorization.split(' ')[1];

    User.findOne({token: token}, {__v: 0, password: 0, token: 0, org_id: 0, role: 0}, function (err, user) {
      /* istanbul ignore if */
      if (err) { res.status (400).json (err); }

      /* istanbul ignore if */
      if (!user) {
        res.status (404).send ('User not found');
      } else {
        res.status (200).json (user);
      }
    });
  }
};

const USER_PROJECTION = {
  password: 0,
  token: 0
};

UserController.prototype.getAll = function () {
  var opts = {
    on: {
      prepareProjection: function (req, callback) {
        return callback (null, USER_PROJECTION);
      }
    }
  };

  return mongodb.ResourceController.prototype.getAll.call (this, opts);
};

UserController.prototype.get = function () {
  var opts = {
    on: {
      prepareProjection: function (req, callback) {
        return callback (null, USER_PROJECTION);
      }
    }
  };

  return mongodb.ResourceController.prototype.get.call (this, opts);
};

blueprint.controller (UserController, ResourceController);

module.exports = exports = UserController;
