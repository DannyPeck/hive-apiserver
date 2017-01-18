'use strict';

var mongodb    = require ('@onehilltech/blueprint-mongodb')
  , StatPlugin = mongodb.plugins.StatPlugin
  ;

var Organization = require ('./Organization')
  ;

var schema = new mongodb.Schema ({
  org_id:   {type: mongodb.Schema.ObjectId, ref: Organization.modelName, required: false, validation: { optional: true }},
  sender:   {type: String, required: false, trim: true},
  receiver: {type: String, required: true, trim: true},
  received: {type: Boolean, required: true},
  viewed:   {type: Boolean, required: true},
  expireAt: {type: Date, required: false, default: Date.now()},
  title:    {type: String, required: true, trim: true},
  content:  {type: String, required: true, trim: true}
});

// register stat plugin with schema
schema.plugin (StatPlugin);

const MODEL_NAME = 'message';
const COLLECTION_NAME = 'messages';

module.exports = mongodb.resource (MODEL_NAME, schema, COLLECTION_NAME);
