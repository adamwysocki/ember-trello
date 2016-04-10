/* jshint node: true */
'use strict';

module.exports = {
  name: 'ember-trello',

  contentFor: function(type, config){
    var emberTrelloConfig = config.emberTrello || {};

    if (type === 'head' && emberTrelloConfig.key != null){
      return `<script src="https://api.trello.com/1/client.js?key=${emberTrelloConfig.key}"></script>\n`;
    }
  }

};
