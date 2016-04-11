import DS from 'ember-data';

const { JSONAPISerializer } = DS;

export default JSONAPISerializer.extend({
  createBaseRecord(type, payload) {
    let model = {};

    model.id           = payload.id;
    model.type         = type;
    model.attributes   = {};

    return model;
  },
  createRelationshipRecord(type, payload) {
    let model = {};

    model.id           = payload.id;
    model.type         = type;

    return model;
  },
  createIncludedRecord(type, payload) {
    let model = {};

    model.id           = payload.id;
    model.type         = type;
    model.attributes   = {};

    return model;
  },
  extractAttributes(modelClass, payload) {
    let attributes = {};

    modelClass.eachAttribute((key) => {
      if (payload.hasOwnProperty(key)) {
        attributes[key] = payload[key];
      }
    });

    return attributes;
  }
});
