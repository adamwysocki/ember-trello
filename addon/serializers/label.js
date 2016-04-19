import {default as BaseSerializer} from './base';

const LABEL_MODEL_NAME = "label";

export default BaseSerializer.extend({
  createBaseRecord(payload) {
    return this.createBaseRecord(this.getType(), payload);
  },
  normalizeDeleteRecordResponse () {
    return { meta: {} };
  },
  normalizeSingleResponse(store, type, payload) {
    let label               = {};
    label.data              = this.createBaseRecord(payload);
    label.data.attributes   = this.extractAttributes(type, payload);
    return label;
  },
  getType() {
    return LABEL_MODEL_NAME;
  },
  extractLabel(parent, label, type) {
    let relationship          = this.createRelationshipRecord(this.getType(), label);
    let included              = this.createIncludedRecord(this.getType(), label);
    included.attributes       = this.extractAttributes(type, label);

    if(parent.hasOwnProperty('data')) {
      parent.data.relationships.labels.data.push(relationship);
    } else {
      parent.relationships.labels.data.push(relationship);
    }

    parent.included.push(included);

    return parent;
  },
  extractLabels(parent, payload, type) {
    if(payload.labels) {
      if(parent.hasOwnProperty('data')) {
        parent.data.relationships.labels      = {};
        parent.data.relationships.labels.data = [];
      } else {
        parent.relationships.labels           = {};
        parent.relationships.labels.data      = [];
      }

      for(let index = 0; index < payload.labels.length; index++) {
        let remote      = payload.labels[index];
        parent          = this.extractLabel(parent, remote, type);
      }
    }

    return parent;
  }
});
