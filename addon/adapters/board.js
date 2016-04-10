import DS from 'ember-data';
import Ember from 'ember';

const { RESTAdapter } = DS;
const { inject } = Ember;

const NOT_AUTHORIZED_ERROR =
    "[Ember Trello] Not authorized. Invalid Trello token and/or key.";

/**
 * The Trello REST Framework adapter allows your store to communicate
 * with Trello APIs by adjusting the JSON and URL structure implemented
 * by Ember Data to match that of the Trello API.
 *
 *
 * @class TrelloBoardAdapter
 * @constructor
 * @extends DS.RESTAdapter
 */
export default RESTAdapter.extend({
  trelloAuth: inject.service('TrelloAuth'),
  host: 'https://api.trello.com',
  namespace: '1/boards',
  headers: {
    'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8'
  },
  /****************************************************************************
   * Override buildURL.
   *
   * @param modelName {String}
   * @param id {Number}
   * @param snapshot {DS.Snapshot}
   * @param requestType {String}
   * @param query {Object}
   * @return url {String}
   */
  buildURL: function(modelName, id, snapshot, requestType, query) {
    const baseUrl     = `${this.get('host')}/${this.get('namespace')}`;
    const token       = this.trelloAuth.get('token');
    const key         = this.trelloAuth.get('key');
    const authParams  = `?key=${key}&token=${token}`;
    let url           = null;

    if(!token || !key) {
      console.error(NOT_AUTHORIZED_ERROR);
      throw new Error(NOT_AUTHORIZED_ERROR);
    }

    switch (requestType) {
      case 'findAll':
        url = `${this.get('host')}/1/members/me/boards${authParams}&filter=open`;
        break;
      case 'updateRecord':
      case 'findRecord':
      case 'deleteRecord':
        url = `${baseUrl}/${id}${authParams}`;
        break;
      case 'createRecord':
        url = `${baseUrl}${authParams}`;
        break;
      case 'queryRecord':
        url = `${baseUrl}/${query.id}${authParams}`;
        break;
      default:
        console.error('[Ember Trello] Unknown request type for board model.');
        throw new Error('Unknown request type for board model.');
    }

    return url;
  },
  /****************************************************************************
   * Override deleteRecord
   *
   * @param {DS.Store} store
   * @param {DS.Model} type
   * @param {DS.Snapshot} snapshot
   * @return {Promise} promise
   */
  deleteRecord: function(store, type, record) {
    let id              = Ember.get(record, 'id');
    let data            = null;
    let params          = {};

    params.closed       = true;

    data                = this._processAttributes(params);

    let url = this.buildURL(type.typeKey, id, record, "deleteRecord", data);

    return this._ajax(url, data, "PUT");
  },
  /****************************************************************************
   * Override updateRecord
   *
   * @param {DS.Store} store
   * @param {DS.Model} type
   * @param {DS.Snapshot} snapshot
   * @return {Promise} promise
   */
  updateRecord: function(store, type, record) {
    let id              = Ember.get(record, 'id');
    let attributes      = Ember.get(record, '_attributes');
    let data            = null;
    let params          = {};

    params.name         = Ember.get(attributes, 'name');
    params.desc         = Ember.get(attributes, 'desc');
    params.closed       = Ember.get(attributes, 'closed');
    params.subscribed   = Ember.get(attributes, 'subscribed');

    data                = this._processAttributes(params);

    let url = this.buildURL(type.typeKey, id, record, "updateRecord", data);

    return this._ajax(url, data, "PUT");
  },
  /****************************************************************************
   * Override createRecord.
   *
   * @param {DS.Store} store
   * @param {DS.Model} type
   * @param {DS.Snapshot} snapshot
   * @return {Promise} promise
   */
  createRecord: function(store, type, record) {
    let attributes      = Ember.get(record, '_attributes');
    let data            = null;
    let params          = {};

    params.name         = Ember.get(attributes, 'name');
    params.desc         = Ember.get(attributes, 'desc');
    params.starred      = Ember.get(attributes, 'starred');
    params.subscribed   = Ember.get(attributes, 'subscribed');

    data                = this._processAttributes(params);

    let url = this.buildURL(type.typeKey, null, record, "createRecord", data);

    return this._ajax(url, data, "POST");
  },
  /****************************************************************************
   * _ajax - wrap ajax call
   *
   * @param {String} url
   * @param {String} data (form encoded)
   * @param {String} type ("PUT", "POST", "DELETE")
   * @return {Promise} promise
   */
  _ajax: function(url, data, type) {
    return new Ember.RSVP.Promise(function(resolve, reject) {
      Ember.$.ajax({
        type: type,
        url: url,
        data: data
      }).then(function(data) {
        Ember.run(null, resolve, data);
      }, function(jqXHR) {
        jqXHR.then = null; // tame jQuery's ill mannered promises
        Ember.run(null, reject, jqXHR);
      });
    });
  },
  /****************************************************************************
   * _processAttributes - transform attribute object to form encoded string
   *
   * @param {Object} params
   * @param {Object} attributes
   * @return {String} data
   */
  _processAttributes: function(params) {
    let count = 0;
    let data  = null;

    for (var key in params) {
        if (params.hasOwnProperty(key)) {
          let value     = Ember.get(params, key);
          let element   = `${key}=${value}`;

          if(count) {
            data = data + '&' + element;
          } else {
            data = element;
          }

          count++;
        }
    }

    return data;
  }
});
