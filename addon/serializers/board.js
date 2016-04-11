import { default as TrelloBaseSerializer } from './base';

const BOARD_MODEL_NAME = "board";

export default TrelloBaseSerializer.extend({
  hasRelationships() {
    return false;
  },
  normalizeBoardRelationships(board){
    return board;
  },
  normalizeUpdateRecordResponse (/*store, primaryModelClass, payload, id, requestType*/) {
    return { meta: {} };
  },
  normalizeSingleResponse(store, type, payload) {
    let board                 = {};
    board.data                = this.createBaseRecord(type, payload);
    board.data.attributes     = this.extractAttributes(type, payload);

    if(this.hasRelationships(payload)) {
      board.data.relationships  = {};
      board.included            = [];

      board = this.normalizeBoardRelationships(board, payload);
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
      let board           = this.createBaseRecord(type, payloadBoard);
      board.attributes    = this.extractAttributes(type, payloadBoard);

      if(this.hasRelationships(payloadBoard)) {
        board.relationships       = {};
        board.included            = [];

        board = this.normalizeBoardRelationships(board, payloadBoard);
      }

      results.push(board);
    }

    return { data: results };
  },
  getType() {
    return BOARD_MODEL_NAME;
  },
  normalizeBoard(parent, board, single = false) {
    let relationship          = this.createRelationshipRecord(this.getType(), board);
    let included              = this.createIncludedRecord(this.getType(), board);
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
  normalizeBoards(parent, payload) {
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
          parent          = this.normalizeBoard(parent, remote);
        }
      } else {
        parent           = this.normalizeBoard(parent, payload.board);
      }
    }

    return parent;
  }
});
