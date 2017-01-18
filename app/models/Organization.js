'use strict';

var mongodb    = require ('@onehilltech/blueprint-mongodb')
  , StatPlugin = mongodb.plugins.StatPlugin
  ;

var schema = new mongodb.Schema ({
  name:       {type: String, required: true, trim: true},
  location:   {type: String, required: true, trim: true},
  website:    {type: String, required: true, trim: true},
  industry:   {type: String, required: true, trim: true}
});

// register stat plugin with schema
schema.plugin (StatPlugin);

const MODEL_NAME = 'organization';
const COLLECTION_NAME = 'organizations';

module.exports = mongodb.resource (MODEL_NAME, schema, COLLECTION_NAME);
