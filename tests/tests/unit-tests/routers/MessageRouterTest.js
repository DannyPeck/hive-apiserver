var blueprint = require ('@onehilltech/blueprint')
  , request   = require ('supertest')
  , expect    = require ('chai').expect
  , async     = require ('async')
  ;

var messages = require ('../../../fixtures/messages')
  , appPath = require ('../../../fixtures/appPath')
  , users   = require ('../../../fixtures/users')
  , organizations = require ('../../../fixtures/organizations')
  ;

describe ('MessageRouter', function () {
  before(function (done) {
    blueprint.testing.createApplicationAndStart(appPath, done)
  });

  after (function (done) {
    blueprint.app.models.User.remove ({}, done);
  });
  describe ('/v1/messages', function () {

    var adminAccessToken;
    var newAdmin;
    var newUser;
    var userAccessToken;
    var org_id;

    before (function (done) {
      async.series ([
        function (callback) {
          var Organization = blueprint.app.models.Organization;
          var orgData = organizations[0].organization;

          var organization = new Organization (orgData);
          organization.save (function (err, res) {
            if (err) { return callback (err); }

            org_id = res._id;
            return callback ();
          });
        },

        function (callback) {
          var adminData = users[1];
          var User = blueprint.app.models.User;
          newAdmin = new User(adminData);
          newAdmin.org_id = org_id;

          newAdmin.save(function (err, user) {
            if (err) {
              return callback (err);
            }

            var data = {
              email: user.email,
              password: user.password
            };

            request(blueprint.app.server.app)
            .post('/login')
            .send(data)
            .expect(200)
            .end(function (err, res) {
              if (err) {
                return callback (err);
              }

              adminAccessToken = res.body.token;
              return callback ();
            });
          });
        },

        function (callback) {
          var userData = users[0];
          var User = blueprint.app.models.User;
          newUser = new User (userData);
          newUser.org_id = org_id;

          newUser.save(function (err, user) {
            if (err) {
              return callback (err);
            }

            var data = {
              email: user.email,
              password: user.password
            };

            request(blueprint.app.server.app)
            .post('/login')
            .send(data)
            .expect(200)
            .end(function (err, res) {
              if (err) {
                return callback (err);
              }

              userAccessToken = res.body.token;
              return callback ();
            });
          });
        }
      ], done);
    });

    describe ('POST', function () {
      it ('should create a new message in the database', function (done) {
        var messageData = messages[0];
        request (blueprint.app.server.app)
        .post ('/v1/messages')
        .set ('Authorization', 'bearer ' + userAccessToken)
        .send({message: messageData})
        .expect (200)
        .end(function (err, res) {
          if (err) { return done (err); }

          expect (res.body.message.receiver).to.equal (newUser.username);
          return done ();
        });
      });
    });
    describe ('GET', function () {
      it ('should retrieve all messages', function (done) {
        request (blueprint.app.server.app)
        .get('/v1/messages')
        .set('Authorization', 'bearer ' + adminAccessToken)
        .expect(200, done);
      });

      it ('should retrieve all messages by sender', function (done) {
        request (blueprint.app.server.app)
        .get ('/v1/messages?sender=' + newUser.username)
        .set ('Authorization', 'bearer ' + userAccessToken)
        .expect (200, done);
      });

      it ('should retrieve messages to be received by user', function (done) {
        request (blueprint.app.server.app)
        .get ('/v1/messages?receiver=' + newUser.username)
        .set('Authorization', 'bearer ' + userAccessToken)
        .expect(200)
        .end(function (err, res) {
          if (err) { return done (err); }

          expect (res.body.messages[0].receiver).to.equal (newUser.username);
          return done ();
        });
      });

      it ('should retrieve all messages by organization', function (done) {
        request (blueprint.app.server.app)
        .get ('/v1/messages?org_id=' + newAdmin.org_id)
        .set ('Authorization', 'bearer ' + adminAccessToken)
        .expect (200, done);
      });

      it ('should fail to retrieve all messages using unauthorized query parameters', function (done) {
        request (blueprint.app.server.app)
        .get ('/v1/messages?org_id=' + newUser.org_id)
        .set ('Authorization', 'bearer ' + userAccessToken)
        .expect (400, done);
      });

      it ('should fail to retrieve all messages for a user request', function (done) {
        request (blueprint.app.server.app)
        .get ('/v1/messages')
        .set ('Authorization', 'bearer ' + userAccessToken)
        .expect (400, done);
      });
    });
  });
});
