// OrganizationRouter
module.exports = exports = {
  '/organizations' : {
    resource: {
      controller: 'OrganizationController',
      deny: ['create', 'delete']
    }

  }
};
