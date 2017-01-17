var _ = require ('lodash')
  ;

var query = {};

var intersect = function (queries, list) {
  // if queries is empty and none is specified in the list
  if (_.isEmpty (queries) && _.includes (list, 'none')) {
    return true;
  }

  for (var query in queries) {
    if (_.includes (list, query)) {
      return true;
    }
  }

  return false;
};

query.allow = function (whitelist) {
  return function (req, res, next) {
    var queries = req.query;

    if (!intersect (queries, whitelist)) {
      return res.status (403).send ('unauthorized query parameter');
    }

    next ();
  }
};

query.deny = function (blacklist) {
  return function (req, res, next) {
    var queries = req.query;

    if (intersect (queries, blacklist)) {
      return res.status (403).send ('unauthorized query parameter');
    }

    next ();
  }
};

module.exports = query;