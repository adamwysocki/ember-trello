import {default as BaseSerializer} from './base';
import { default as LabelSerializer } from './label';

const BOARD_MODEL_NAME = "board";

export default BaseSerializer.extend({
  hasRelationships(payload) {
    return ( payload.labels );
  },
  extractRelationships(board, payload){
    let labelSerializer = new LabelSerializer();

    board               = labelSerializer.extractLabels(board, payload,
                                                        this.store.modelFor('label'));

    return board;
  },
  normalizeUpdateRecordResponse () {
    return { meta: {} };
  },
  normalizeSingleResponse(store, type, payload) {
    let board                 = {};
    board.data                = this.createBaseRecord(this.getType(), payload);
    board.data.attributes     = this.extractAttributes(type, payload);

    if(this.hasRelationships(payload)) {
      board.data.relationships  = {};
      board.included            = [];

      board = this.extractRelationships(board, payload);
    }

    return board;
  },
  normalizeQueryResponse (store, primaryModelClass, payload) {
    return this.normalizeFindAllResponse(store, primaryModelClass, payload);
  },
  normalizeFindAllResponse(store, type, payload) {
    let results = [];

    if(!payload) {
      return { data: results };
    }

    for(let index = 0; index < payload.length; index++) {
      let payloadBoard    = payload[index];
      let board           = this.createBaseRecord(this.getType(), payloadBoard);
      board.attributes    = this.extractAttributes(type, payloadBoard);

      if(this.hasRelationships(payloadBoard)) {
        board.relationships       = {};
        board.included            = [];

        board = this.extractRelationships(board, payloadBoard);
      }

      results.push(board);
    }

    return { data: results };
  },
  getType() {
    return BOARD_MODEL_NAME;
  },
  extractBoard(parent, board, type, single = false) {
    let relationship          = this.createRelationshipRecord(type, board);
    let included              = this.createIncludedRecord(type, board);
    included.attributes       = this.extractAttributes(type, board);

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
  }
});
