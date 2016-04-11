import Ember from 'ember';

/******************************************************************************
 * The Trello REST Framework adapter allows your store to communicate
 * with Trello APIs by adjusting the JSON and URL structure implemented
 * by Ember Data to match that of the Trello API.
 *
 *
 * @class TrelloAdapterError
 * @constructor
 * @extends Ember.Object
 */
export default Ember.Object.extend({
  NOT_AUTHORIZED: "[Ember-CLI Trello] Not authorized. Invalid Trello token and/or key.",
  BAD_REQUEST_TYPE: "[Ember-CLI Trello] Unknown request type for Ember-CLI Trello model."
});
