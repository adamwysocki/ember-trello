//////////////////////////////////////////////////////////////////////
// BaseSerializer
//
// Helper methods for serializing REST data into JSON API format
//
export default class BaseSerializer {
  static createBaseRecord(type, payload) {
    let model = {};

    model.id           = payload.id;
    model.type         = type;
    model.attributes   = {};

    return model;
  }

  static createRelationshipRecord(type, payload) {
    let model = {};

    model.id           = payload.id;
    model.type         = type;

    return model;
  }

  static createIncludedRecord(type, payload) {
    let model = {};

    model.id           = payload.id;
    model.type         = type;
    model.attributes   = {};

    return model;
  }

  static extractAttributes(modelClass, payload) {
    let attributes = {};

    modelClass.eachAttribute((key) => {
      if (payload.hasOwnProperty(key)) {
        attributes[key] = payload[key];
      }
    });

    return attributes;
  }

}
