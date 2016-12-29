var User = require ('../models/User');

var authenticate = {};

authenticate.isAdminToken  = function (req, res, next) {
    var role = req.user.role;

    if (role !== 'admin') {
      return res.status (403).send ('User is a not an admin');
    }

    return next ();
};

authenticate.isAdminUser = function (req, res, next) {

  var email = req.body.email;

  // retrieve user by token
  User.findOne ({email: email}, function (err, user) {
    /* instanbul ignore if */
    if (err) { return next (err); }

    //verify that a user was found in database if not, send error
    if(!user){
      return res.status (404).send('User not found');
    }

    // verify that the user has the admin role
    var role = user.role;
    if (role !== 'admin') {
      return res.status (403).send ('User is a not an admin');
    }

    return next ();
  });
}

module.exports = exports = authenticate;
