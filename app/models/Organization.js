var mongodb = require ('@onehilltech/blueprint-mongodb')
  ;

var schema = new mongodb.Schema({
  name:       {type: String, required: true, trim: true},
  location:   {type: String, required: true, trim: true},
  website:    {type: String, required: true, trim: true},
  industry:   {type: String, required: true, trim: true}
});

const MODEL_NAME = 'organization';
const COLLECTION_NAME = 'organizations';

module.exports = mongodb.resource (MODEL_NAME, schema, COLLECTION_NAME);
