'use strict';

var passport = require ('passport');

module.exports = exports = {
  '/v1': passport.authenticate ('bearer', {session: false}),
  '/organizations': {
    post: {action: 'OrganizationController@create'}
  }
};
