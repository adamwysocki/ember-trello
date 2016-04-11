import DS from 'ember-data';
import BaseSerializer from './base';
import { default as LabelSerializer } from './label';
import { default as ListSerializer } from './list';
import { default as MembershipSerializer } from './membership';

const { JSONAPISerializer } = DS;

const BOARD_MODEL_NAME = "board";

export default JSONAPISerializer.extend({
  hasRelationships(payload) {
    return false;
    //return (payload.lists || payload.labels || payload.memberships);
  },
  serializeRelationships(board, payload){
    /*
    let membershipSerializer  = new MembershipSerializer();
    let labelSerializer       = new LabelSerializer();
    let listSerializer        = new ListSerializer();

    board = listSerializer.serializeLists(board, payload);
    board = labelSerializer.serializeLabels(board, payload);
    board = membershipSerializer.serializeMemberships(board, payload);
    */
    return board;
  },
  serializeBaseAttributes(payload) {
    let attributes = {};

    attributes.closed             = payload.closed;
    attributes.dateLastActivity   = payload.dateLastActivity;
    attributes.dateLastView       = payload.dateLastView;
    attributes.desc               = payload.desc;
    attributes.descData           = payload.descData;
    attributes.idOrganization     = payload.idOrganization;
    attributes.idTags             = payload.idTags;
    attributes.invitations        = payload.invitations;
    attributes.invited            = payload.invited;
    attributes.labelNames         = payload.labelNames;
    attributes.name               = payload.name;
    attributes.pinned             = payload.pinned;
    attributes.powerUps           = payload.powerUps;
    attributes.prefs              = payload.prefs;
    attributes.shortLink          = payload.shortLink;
    attributes.shortUrl           = payload.shortUrl;
    attributes.starred            = payload.starred;
    attributes.subscribed         = payload.subscribed;
    attributes.url                = payload.url;

    return attributes;
  },
  createBaseRecord(payload) {
    return BaseSerializer.createBaseRecord(this.getType(), payload);
  },
  normalizeUpdateRecordResponse (/*store, primaryModelClass, payload, id, requestType*/) {
    return { meta: {} };
  },
  normalizeSingleResponse(store, type, payload) {
    let board                 = {};
    board.data                = this.createBaseRecord(payload);
    board.data.attributes     = this.serializeBaseAttributes(payload);

    if(this.hasRelationships(payload)) {
      board.data.relationships  = {};
      board.included            = [];

      board = this.serializeRelationships(board, payload);
    }

    return board;
  },
  normalizeFindAllResponse(store, type, payload) {
    let results = [];

    if(!payload) {
      return { data: results };
    }

    for(let index = 0; index < payload.length; index++) {
      let payloadBoard    = payload[index];
      let board           = this.createBaseRecord(payloadBoard);
      board.attributes    = this.serializeBaseAttributes(payloadBoard);

      if(this.hasRelationships(payloadBoard)) {
        board.relationships       = {};
        board.included            = [];

        board = this.serializeRelationships(board, payloadBoard);
      }

      results.push(board);
    }

    return { data: results };
  },
  getType() {
    return BOARD_MODEL_NAME;
  },
  createRelationshipRecord(payload) {
    return BaseSerializer.createRelationshipRecord(this.getType(), payload);
  },
  createIncludedRecord(payload) {
    return BaseSerializer.createIncludedRecord(this.getType(), payload);
  },
  serializeBoard(parent, board, single = false) {
    let relationship          = this.createRelationshipRecord(board);
    let included              = this.createIncludedRecord(board);
    included.attributes       = this.serializeBaseAttributes(board);

    if(single) {
      if(parent.hasOwnProperty('data')) {
        parent.data.relationships.board       = {};
        parent.data.relationships.board.data  = {};
        parent.data.relationships.board.data  = relationship;
      } else {
        parent.relationships.boards           = {};
        parent.relationships.boards.data      = {};
        parent.relationships.boards.data      = relationship;
      }
    } else {
      if(parent.hasOwnProperty('data')) {
        parent.data.relationships.boards.data.push(relationship);
      } else {
        parent.relationships.boards.data.push(relationship);
      }
    }

    parent.included.push(included);

    return parent;
  },
  serializeBoards(parent, payload) {
    if(payload.boards || payload.board) {
      if(parent.hasOwnProperty('data')) {
        parent.data.relationships.boards      = {};
        parent.data.relationships.boards.data = [];
      } else {
        parent.relationships.boards       = {};
        parent.relationships.boards.data  = [];
      }

      if(payload.boards) {
        for(let index = 0; index < payload.boards.length; index++) {
          let remote      = payload.boards[index];
          parent          = this.serializeBoard(parent, remote);
        }
      } else {
        parent           = this.serializeBoard(parent, payload.board);
      }
    }

    return parent;
  }
});
